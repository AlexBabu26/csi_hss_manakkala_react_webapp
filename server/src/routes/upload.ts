import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { uploadFileToB2, deleteFileFromB2, isB2Configured, getAuthorizedB2Url, downloadB2File } from '../services/b2Storage.js';
import multer from 'multer';
import crypto from 'crypto';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Generate a hash for ETag from URL
const generateETag = (url: string): string => {
  return crypto.createHash('md5').update(url).digest('hex');
};

// Check B2 configuration status
router.get('/status', authenticateToken, (_req: AuthRequest, res) => {
  const configured = isB2Configured();
  
  res.json({
    configured,
    provider: configured ? 'Backblaze B2 (Private)' : 'Base64 (local)',
    bucketType: configured ? 'Private with Authorization Tokens' : 'N/A',
    message: configured 
      ? 'Backblaze B2 is configured with private bucket. Images require authorization.'
      : 'Backblaze B2 not configured. Images will be stored as base64 in database.'
  });
});

// Generate authorized URL for a B2 file (for private buckets)
router.post('/authorize', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { url, duration } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    // Only generate auth for B2 URLs
    if (url.startsWith('data:')) {
      return res.json({ 
        authorizedUrl: url,
        message: 'Base64 image, no authorization needed'
      });
    }

    if (!isB2Configured()) {
      return res.status(503).json({ 
        error: 'Backblaze B2 not configured'
      });
    }

    // Generate authorized URL (default: 1 hour)
    const validDuration = duration || 3600;
    const authorizedUrl = await getAuthorizedB2Url(url, validDuration);

    res.json({ 
      authorizedUrl,
      expiresIn: validDuration,
      message: 'Authorized URL generated successfully'
    });
  } catch (error: any) {
    console.error('Authorization error:', error);
    res.status(500).json({ 
      error: 'Failed to generate authorized URL',
      details: error.message
    });
  }
});

// In-memory cache for frequently accessed images
const imageCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Proxy endpoint to serve B2 images through backend (most secure approach)
router.get('/proxy', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    // If it's base64, return as-is
    if (url.startsWith('data:')) {
      const base64Data = url.split(',')[1];
      const mimeType = url.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      const buffer = Buffer.from(base64Data, 'base64');
      const etag = generateETag(url);
      
      // Check if client has cached version
      if (req.headers['if-none-match'] === `"${etag}"`) {
        return res.status(304).send(); // Not Modified
      }
      
      res.set('Content-Type', mimeType);
      res.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
      res.set('ETag', `"${etag}"`);
      return res.send(buffer);
    }

    if (!isB2Configured()) {
      return res.status(503).json({ 
        error: 'Backblaze B2 not configured'
      });
    }

    // Generate consistent ETag for this URL
    const etag = generateETag(url);
    
    // Check if client has cached version (304 Not Modified)
    if (req.headers['if-none-match'] === `"${etag}"`) {
      res.set('X-Cache', 'BROWSER-HIT');
      return res.status(304).send();
    }
    
    // Check server cache
    const cached = imageCache.get(url);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      res.set('Content-Type', cached.contentType);
      res.set('Cache-Control', 'public, max-age=86400, immutable'); // 24 hours
      res.set('X-Cache', 'SERVER-HIT');
      res.set('ETag', `"${etag}"`);
      res.set('Vary', 'Authorization');
      return res.send(cached.buffer);
    }

    // Download file from B2 with authorization
    const fileBuffer = await downloadB2File(url);
    
    // Determine content type from URL
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    };
    const contentType = mimeTypes[extension || ''] || 'application/octet-stream';

    // Store in cache
    imageCache.set(url, {
      buffer: fileBuffer,
      contentType,
      timestamp: Date.now()
    });

    // Clean old cache entries periodically
    if (imageCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of imageCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          imageCache.delete(key);
        }
      }
    }

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400, immutable'); // 24 hours
    res.set('X-Cache', 'MISS');
    res.set('ETag', `"${etag}"`);
    res.set('Vary', 'Authorization');
    res.send(fileBuffer);
  } catch (error: any) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve image',
      details: error.message
    });
  }
});

// Upload single image (multipart form data)
router.post('/image', authenticateToken, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // If B2 is not configured, return base64
    if (!isB2Configured()) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({ 
        url: base64,
        provider: 'base64',
        message: 'Image stored as base64 (B2 not configured)'
      });
    }

    // Upload to B2
    const fileUrl = await uploadFileToB2(
      req.file.originalname,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ 
      url: fileUrl,
      provider: 'backblaze-b2',
      message: 'Image uploaded to Backblaze B2'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Fallback to base64 if B2 upload fails
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({ 
        url: base64,
        provider: 'base64-fallback',
        message: 'B2 upload failed, using base64 fallback'
      });
    }
    
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload multiple images (multipart form data)
router.post('/images', authenticateToken, upload.array('images'), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const urls: string[] = [];

    // If B2 is not configured, return base64
    if (!isB2Configured()) {
      for (const file of files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        urls.push(base64);
      }
      return res.json({ 
        urls,
        provider: 'base64',
        message: 'Images stored as base64 (B2 not configured)'
      });
    }

    // Upload all files to B2
    for (const file of files) {
      const fileUrl = await uploadFileToB2(
        file.originalname,
        file.buffer,
        file.mimetype
      );
      urls.push(fileUrl);
    }

    res.json({ 
      urls,
      provider: 'backblaze-b2',
      message: `${urls.length} images uploaded to Backblaze B2`
    });
  } catch (error: any) {
    console.error('Multi-upload error:', error);
    
    // Fallback to base64 if B2 upload fails
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (const file of files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        urls.push(base64);
      }
      return res.json({ 
        urls,
        provider: 'base64-fallback',
        message: 'B2 upload failed, using base64 fallback'
      });
    }
    
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

// Delete image
router.delete('/image', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Only attempt to delete if it's a B2 URL (not base64)
    if (!url.startsWith('data:') && isB2Configured()) {
      try {
        await deleteFileFromB2(url);
        return res.json({ 
          success: true,
          message: 'Image deleted from Backblaze B2'
        });
      } catch (error: any) {
        console.error('B2 delete error:', error);
        return res.status(500).json({ 
          error: 'Failed to delete image from B2',
          details: error.message
        });
      }
    }

    // If it's a base64 image, no deletion needed
    res.json({ 
      success: true,
      message: 'No external file to delete (base64 image)'
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

export default router;
