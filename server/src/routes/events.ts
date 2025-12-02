import { Router } from 'express';
import { sql } from '../db/pool.js'; // Using connection pool
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const eventSchema = z.object({
  title: z.string().min(1),
  event_date: z.string(), // ISO date string
  description: z.string(),
  images: z.array(z.string()),
});

// In-memory cache for events
let eventsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all events (public)
router.get('/', async (_req, res) => {
  try {
    // Check cache first
    if (eventsCache && (Date.now() - eventsCache.timestamp) < CACHE_DURATION) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(eventsCache.data);
    }

    const events = await sql`
      SELECT event_id as id, title, event_date, description, created_at, updated_at
      FROM tbl_events
      ORDER BY event_date DESC
    `;

    // Get images for each event
    const formattedEvents = await Promise.all(events.map(async (event) => {
      const eventImages = await sql`
        SELECT image_url
        FROM tbl_event_images
        WHERE event_id = ${event.id}
        ORDER BY display_order
      `;
      
      return {
        id: event.id.toString(),
        title: event.title,
        date: event.event_date,
        description: event.description || '',
        images: eventImages.map(img => img.image_url),
      };
    }));

    // Update cache
    eventsCache = {
      data: formattedEvents,
      timestamp: Date.now()
    };

    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
      SELECT event_id as id, title, event_date, description, created_at, updated_at
      FROM tbl_events
      WHERE event_id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = result[0];
    
    // Get event images
    const eventImages = await sql`
      SELECT image_url
      FROM tbl_event_images
      WHERE event_id = ${id}
      ORDER BY display_order
    `;
    
    res.json({
      id: event.id.toString(),
      title: event.title,
      date: event.event_date,
      description: event.description || '',
      images: eventImages.map(img => img.image_url),
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (protected)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, event_date, description, images } = eventSchema.parse(req.body);

    const result = await sql`
      INSERT INTO tbl_events (title, event_date, description, is_published)
      VALUES (${title}, ${event_date}, ${description}, true)
      RETURNING event_id as id, title, event_date, description
    `;

    const event = result[0];
    const eventId = event.id;
    
    // Insert event images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await sql`
          INSERT INTO tbl_event_images (event_id, image_url, display_order, is_primary)
          VALUES (${eventId}, ${images[i]}, ${i + 1}, ${i === 0})
        `;
      }
    }
    
    // Invalidate cache
    eventsCache = null;

    res.status(201).json({
      id: event.id.toString(),
      title: event.title,
      date: event.event_date,
      description: event.description || '',
      images: images,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (protected)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, event_date, description, images } = eventSchema.parse(req.body);

    const result = await sql`
      UPDATE tbl_events 
      SET 
        title = ${title},
        event_date = ${event_date},
        description = ${description},
        updated_at = NOW()
      WHERE event_id = ${id}
      RETURNING event_id as id, title, event_date, description
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete existing images and re-insert
    await sql`DELETE FROM tbl_event_images WHERE event_id = ${id}`;
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await sql`
          INSERT INTO tbl_event_images (event_id, image_url, display_order, is_primary)
          VALUES (${id}, ${images[i]}, ${i + 1}, ${i === 0})
        `;
      }
    }

    // Invalidate cache
    eventsCache = null;

    const event = result[0];
    res.json({
      id: event.id.toString(),
      title: event.title,
      date: event.event_date,
      description: event.description || '',
      images: images,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Delete event images first (cascade should handle this, but being explicit)
    await sql`DELETE FROM tbl_event_images WHERE event_id = ${id}`;
    
    const result = await sql`
      DELETE FROM tbl_events 
      WHERE event_id = ${id}
      RETURNING event_id as id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Invalidate cache
    eventsCache = null;

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;

