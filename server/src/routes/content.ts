import express from "express";
import { z } from "zod";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

const contentSchema = z.object({
  content_key: z.string(),
  content_data: z.any(),
});

router.get("/:page_key", async (req, res) => {
  try {
    const { page_key } = req.params;
    const result = await query(
      "SELECT content_data FROM tbl_site_content WHERE content_key = $1",
      [page_key]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    res.json(result.rows[0].content_data);
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:page_key", authenticate, async (req, res) => {
  try {
    const { page_key } = req.params;
    const content_data = req.body;
    const parsed = contentSchema.parse({ content_key: page_key, content_data });
    const userId = req.user?.id ?? null;

    const result = await query(
      `INSERT INTO tbl_site_content (content_key, content_data, updated_by, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (content_key)
       DO UPDATE SET content_data = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [page_key, JSON.stringify(parsed.content_data), userId]
    );

    res.json({
      message: "Content updated successfully",
      data: result.rows[0].content_data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.issues });
      return;
    }

    console.error("Update content error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
