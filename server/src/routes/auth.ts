import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../db/pool.js'; // Using connection pool
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const users = await sql`
      SELECT user_id as id, email, password_hash, full_name as name 
      FROM tbl_users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const decoded = jwt.verify(token, secret) as { id: number; email: string };

    // Fetch fresh user data
    const users = await sql`
      SELECT user_id as id, email, full_name as name 
      FROM tbl_users 
      WHERE user_id = ${decoded.id}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

export default router;

