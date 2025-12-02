import { Router } from 'express';
import { sql } from '../db/pool.js'; // Using connection pool
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

// In-memory cache for content
let contentCache: { data: Record<string, any>; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all content (public)
router.get('/', async (_req, res) => {
  try {
    // Check cache first
    if (contentCache && (Date.now() - contentCache.timestamp) < CACHE_DURATION) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(contentCache.data);
    }

    const content = await sql`
      SELECT content_key, content_data 
      FROM tbl_site_content 
      ORDER BY content_key
    `;

    const contentMap: Record<string, any> = {};
    content.forEach(row => {
      contentMap[row.content_key] = row.content_data;
    });

    // Update cache
    contentCache = {
      data: contentMap,
      timestamp: Date.now()
    };

    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.json(contentMap);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get specific content by key (public)
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await sql`
      SELECT content_data 
      FROM tbl_site_content 
      WHERE content_key = ${key}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(result[0].content_data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content (protected)
router.put('/:key', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { key } = req.params;
    const contentData = req.body;

    // Update the content
    const result = await sql`
      UPDATE tbl_site_content 
      SET 
        content_data = ${JSON.stringify(contentData)},
        updated_by = ${req.user!.id},
        updated_at = NOW()
      WHERE content_key = ${key}
      RETURNING content_key, content_data
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Invalidate cache on update
    contentCache = null;

    res.json(result[0].content_data);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default router;

