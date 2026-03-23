import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { query } from "../db";
import { loadEnv } from "../env";
import { authenticate } from "../middleware/auth";

loadEnv();

const router = express.Router();
const SALT_ROUNDS = 10;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(6),
});

const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6),
  full_name: z.string().max(255).optional(),
  role: z.string().max(50).optional().default("admin"),
});

const updateUserSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  role: z.string().max(50).optional(),
  is_active: z.boolean().optional(),
});

// ─── Public ──────────────────────────────────────────────

router.post("/login", async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "Server authentication is not configured" });
    return;
  }

  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await query(
      "SELECT * FROM tbl_users WHERE email = $1 AND is_active = true",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    await query(
      "UPDATE tbl_users SET last_login = NOW() WHERE user_id = $1",
      [user.user_id]
    );

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user.user_id, email: user.email, name: user.full_name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Protected (require auth) ────────────────────────────

router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await query(
      "SELECT user_id, email, full_name, role, is_active, last_login, created_at FROM tbl_users WHERE user_id = $1",
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/me", authenticate, async (req, res) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    if (!data.full_name && !data.email) {
      res.status(400).json({ error: "Nothing to update" });
      return;
    }

    if (data.email) {
      const existing = await query(
        "SELECT user_id FROM tbl_users WHERE email = $1 AND user_id != $2",
        [data.email, req.user!.id]
      );
      if (existing.rows.length > 0) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.full_name !== undefined) {
      sets.push(`full_name = $${idx++}`);
      values.push(data.full_name);
    }
    if (data.email !== undefined) {
      sets.push(`email = $${idx++}`);
      values.push(data.email);
    }
    sets.push(`updated_at = NOW()`);
    values.push(req.user!.id);

    const result = await query(
      `UPDATE tbl_users SET ${sets.join(", ")} WHERE user_id = $${idx} RETURNING user_id, email, full_name, role`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/me/password", authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = changePasswordSchema.parse(req.body);

    const result = await query(
      "SELECT password_hash FROM tbl_users WHERE user_id = $1",
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(current_password, result.rows[0].password_hash);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await query(
      "UPDATE tbl_users SET password_hash = $1, updated_at = NOW() WHERE user_id = $2",
      [hash, req.user!.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── User management ─────────────────────────────────────

router.get("/users", authenticate, async (_req, res) => {
  try {
    const result = await query(
      "SELECT user_id, email, full_name, role, is_active, last_login, created_at FROM tbl_users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", authenticate, async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);

    const existing = await query(
      "SELECT user_id FROM tbl_users WHERE email = $1",
      [data.email]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }

    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const result = await query(
      `INSERT INTO tbl_users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING user_id, email, full_name, role, is_active, created_at`,
      [data.email, hash, data.full_name || null, data.role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/:id", authenticate, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const data = updateUserSchema.parse(req.body);

    if (data.email) {
      const existing = await query(
        "SELECT user_id FROM tbl_users WHERE email = $1 AND user_id != $2",
        [data.email, userId]
      );
      if (existing.rows.length > 0) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.full_name !== undefined) {
      sets.push(`full_name = $${idx++}`);
      values.push(data.full_name);
    }
    if (data.email !== undefined) {
      sets.push(`email = $${idx++}`);
      values.push(data.email);
    }
    if (data.role !== undefined) {
      sets.push(`role = $${idx++}`);
      values.push(data.role);
    }
    if (data.is_active !== undefined) {
      sets.push(`is_active = $${idx++}`);
      values.push(data.is_active);
    }

    if (sets.length === 0) {
      res.status(400).json({ error: "Nothing to update" });
      return;
    }

    sets.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await query(
      `UPDATE tbl_users SET ${sets.join(", ")} WHERE user_id = $${idx} RETURNING user_id, email, full_name, role, is_active`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/password", authenticate, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const schema = z.object({ new_password: z.string().min(6) });
    const { new_password } = schema.parse(req.body);

    const hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    const result = await query(
      "UPDATE tbl_users SET password_hash = $1, updated_at = NOW() WHERE user_id = $2 RETURNING user_id",
      [hash, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }
    console.error("Reset user password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
