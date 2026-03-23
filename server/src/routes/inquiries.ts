import express from "express";
import { z } from "zod";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

/**
 * Derive a legacy-compatible status string from the boolean columns
 * so the frontend doesn't need any changes.
 */
function deriveStatus(row: {
  is_read: boolean;
  is_replied: boolean;
}): "unread" | "read" | "replied" {
  if (row.is_replied) return "replied";
  if (row.is_read) return "read";
  return "unread";
}

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = inquirySchema.parse(req.body);
    const result = await query(
      `INSERT INTO tbl_contact_submissions (full_name, email, message)
       VALUES ($1, $2, $3)
       RETURNING submission_id AS id, created_at`,
      [name, email, message]
    );

    res.status(201).json({
      message: "Inquiry submitted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", authenticate, async (_req, res) => {
  try {
    const result = await query(
      `SELECT submission_id AS id, full_name AS name, email, message,
              is_read, is_replied, created_at
       FROM tbl_contact_submissions
       ORDER BY created_at DESC`
    );

    const rows = result.rows.map((row) => ({
      ...row,
      status: deriveStatus(row),
    }));

    res.json(rows);
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/status", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const statusSchema = z.object({
      status: z.enum(["unread", "read", "replied"]),
    });
    const { status } = statusSchema.parse(req.body);

    const isRead = status === "read" || status === "replied";
    const isReplied = status === "replied";

    const result = await query(
      `UPDATE tbl_contact_submissions
       SET is_read = $1, is_replied = $2
       WHERE submission_id = $3
       RETURNING submission_id AS id, full_name AS name, email, message,
                 is_read, is_replied, created_at`,
      [isRead, isReplied, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }

    const row = result.rows[0];
    res.json({
      message: "Inquiry status updated",
      inquiry: { ...row, status: deriveStatus(row) },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
