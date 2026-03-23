import express from "express";
import { z } from "zod";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

const eventSchema = z.object({
  title: z.string().min(1),
  date: z.string(),
  description: z.string().optional(),
});

function toEventDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

function slugify(title: string, date: string): string {
  const datePart = toEventDate(date);
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    datePart
  );
}

router.get("/", async (_req, res) => {
  try {
    const result = await query(
      `SELECT event_id AS id, title, description,
              event_date AS date, event_time, location, category,
              is_featured, is_published, created_at, updated_at
       FROM tbl_events
       WHERE is_published = true
       ORDER BY event_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT event_id AS id, title, description,
              event_date AS date, event_time, location, category,
              is_featured, is_published, created_at, updated_at
       FROM tbl_events WHERE event_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, date, description } = eventSchema.parse(req.body);
    const userId = req.user?.id ?? null;
    const eventDate = toEventDate(date);
    const slug = slugify(title, date);

    const result = await query(
      `INSERT INTO tbl_events (title, slug, description, event_date, is_published, updated_by)
       VALUES ($1, $2, $3, $4, true, $5)
       RETURNING event_id AS id, title, description, event_date AS date, is_published, created_at`,
      [title, slug, description || "", eventDate, userId]
    );

    res
      .status(201)
      .json({ message: "Event created successfully", event: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Create event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, description } = eventSchema.parse(req.body);
    const userId = req.user?.id ?? null;
    const eventDate = toEventDate(date);
    const slug = slugify(title, date);

    const result = await query(
      `UPDATE tbl_events
       SET title = $1, slug = $2, description = $3, event_date = $4,
           updated_by = $5, updated_at = CURRENT_TIMESTAMP
       WHERE event_id = $6
       RETURNING event_id AS id, title, description, event_date AS date, updated_at`,
      [title, slug, description || "", eventDate, userId, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ message: "Event updated successfully", event: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Update event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM tbl_events WHERE event_id = $1 RETURNING event_id",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
