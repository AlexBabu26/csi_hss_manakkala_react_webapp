import express from "express";
import multer from "multer";
import { z } from "zod";
import { query } from "../db";
import { authenticate } from "../middleware/auth";
import { uploadFile } from "../services/b2Storage";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Site Settings (logos, etc.) ────────────────────────────────────────────

router.get("/settings", async (_req, res) => {
  try {
    const result = await query(
      "SELECT setting_key, setting_value FROM tbl_site_settings ORDER BY setting_group, setting_key"
    );
    const map: Record<string, string> = {};
    for (const row of result.rows) map[row.setting_key] = row.setting_value;
    res.json(map);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings/:key", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { key } = req.params;
    let value: string;

    if (req.file) {
      const ext = req.file.originalname.split(".").pop() || "jpg";
      const filename = `settings/${key}-${Date.now()}.${ext}`;
      const uploaded = await uploadFile(filename, req.file.buffer);
      value = uploaded.url;
    } else {
      value = z.object({ value: z.string() }).parse(req.body).value;
    }

    await query(
      `INSERT INTO tbl_site_settings (setting_key, setting_value, updated_by, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (setting_key)
       DO UPDATE SET setting_value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP`,
      [key, value, req.user?.id ?? null]
    );
    res.json({ message: "Setting updated", key, value });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update setting error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Leadership CRUD ────────────────────────────────────────────────────────

router.get("/leadership", async (_req, res) => {
  try {
    const result = await query(
      `SELECT leader_id AS id, full_name, position_title, profile_image_url AS photo_url,
              tenure_period, bio, display_order, is_current
       FROM tbl_leadership WHERE is_active = true ORDER BY display_order`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get leadership error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leadership", authenticate, async (req, res) => {
  try {
    const body = z.object({
      full_name: z.string().min(1),
      position_title: z.string().min(1),
      tenure_period: z.string().optional().default(""),
      bio: z.string().optional().default(""),
    }).parse(req.body);

    const maxOrder = await query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM tbl_leadership");
    const result = await query(
      `INSERT INTO tbl_leadership (full_name, position_title, tenure_period, bio, display_order, is_active, updated_by)
       VALUES ($1, $2, $3, $4, $5, true, $6)
       RETURNING leader_id AS id, full_name, position_title, profile_image_url AS photo_url, tenure_period, bio, display_order, is_current`,
      [body.full_name, body.position_title, body.tenure_period, body.bio, maxOrder.rows[0].next, req.user?.id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input", details: error.issues }); return; }
    console.error("Create leader error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/leadership/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const body = z.object({
      full_name: z.string().min(1),
      position_title: z.string().min(1),
      tenure_period: z.string().optional().default(""),
      bio: z.string().optional().default(""),
    }).parse(req.body);

    const result = await query(
      `UPDATE tbl_leadership SET full_name = $1, position_title = $2, tenure_period = $3, bio = $4,
       updated_by = $5, updated_at = CURRENT_TIMESTAMP WHERE leader_id = $6
       RETURNING leader_id AS id, full_name, position_title, profile_image_url AS photo_url, tenure_period, bio, display_order`,
      [body.full_name, body.position_title, body.tenure_period, body.bio, req.user?.id ?? null, id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Leader not found" }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update leader error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/leadership/:id/photo", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const uploaded = await uploadFile(`leadership/leader-${id}-${Date.now()}.${ext}`, req.file.buffer);
    const result = await query(
      `UPDATE tbl_leadership SET profile_image_url = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE leader_id = $3 RETURNING leader_id AS id, full_name, position_title, profile_image_url AS photo_url`,
      [uploaded.url, req.user?.id ?? null, id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Leader not found" }); return; }
    res.json({ message: "Photo updated", leader: result.rows[0] });
  } catch (error) {
    console.error("Update leadership photo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/leadership/:id", authenticate, async (req, res) => {
  try {
    const result = await query(
      "UPDATE tbl_leadership SET is_active = false, updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE leader_id = $2 RETURNING leader_id AS id",
      [req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Leader not found" }); return; }
    res.json({ message: "Leader deleted" });
  } catch (error) {
    console.error("Delete leader error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/leadership/reorder", authenticate, async (req, res) => {
  try {
    const { ids } = z.object({ ids: z.array(z.number()) }).parse(req.body);
    for (let i = 0; i < ids.length; i++) {
      await query("UPDATE tbl_leadership SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE leader_id = $2", [i, ids[i]]);
    }
    res.json({ message: "Reordered" });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Reorder leadership error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Facilities CRUD ────────────────────────────────────────────────────────

router.get("/facilities", async (_req, res) => {
  try {
    const result = await query(
      `SELECT facility_id AS id, facility_name AS name, description, image_url, alt_text, display_order
       FROM tbl_facilities WHERE is_active = true ORDER BY display_order`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get facilities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/facilities", authenticate, async (req, res) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional().default(""),
      alt_text: z.string().optional().default(""),
    }).parse(req.body);
    const maxOrder = await query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM tbl_facilities");
    const result = await query(
      `INSERT INTO tbl_facilities (facility_name, description, alt_text, display_order, is_active, updated_by)
       VALUES ($1, $2, $3, $4, true, $5)
       RETURNING facility_id AS id, facility_name AS name, description, image_url, alt_text, display_order`,
      [body.name, body.description, body.alt_text, maxOrder.rows[0].next, req.user?.id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Create facility error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/facilities/:id", authenticate, async (req, res) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      description: z.string().optional().default(""),
      alt_text: z.string().optional().default(""),
    }).parse(req.body);
    const result = await query(
      `UPDATE tbl_facilities SET facility_name = $1, description = $2, alt_text = $3,
       updated_by = $4, updated_at = CURRENT_TIMESTAMP WHERE facility_id = $5
       RETURNING facility_id AS id, facility_name AS name, description, image_url, alt_text, display_order`,
      [body.name, body.description, body.alt_text, req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Facility not found" }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update facility error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/facilities/:id/image", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const uploaded = await uploadFile(`facilities/facility-${id}-${Date.now()}.${ext}`, req.file.buffer);
    const result = await query(
      `UPDATE tbl_facilities SET image_url = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE facility_id = $3 RETURNING facility_id AS id, facility_name AS name, image_url`,
      [uploaded.url, req.user?.id ?? null, id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Facility not found" }); return; }
    res.json({ message: "Image updated", facility: result.rows[0] });
  } catch (error) {
    console.error("Update facility image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/facilities/:id", authenticate, async (req, res) => {
  try {
    const result = await query(
      "UPDATE tbl_facilities SET is_active = false, updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE facility_id = $2 RETURNING facility_id AS id",
      [req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Facility not found" }); return; }
    res.json({ message: "Facility deleted" });
  } catch (error) {
    console.error("Delete facility error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/facilities/reorder", authenticate, async (req, res) => {
  try {
    const { ids } = z.object({ ids: z.array(z.number()) }).parse(req.body);
    for (let i = 0; i < ids.length; i++) {
      await query("UPDATE tbl_facilities SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE facility_id = $2", [i, ids[i]]);
    }
    res.json({ message: "Reordered" });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Reorder facilities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Program Categories + Programs CRUD ──────────────────────────────────────

router.get("/programs", async (_req, res) => {
  try {
    const cats = await query(
      `SELECT category_id AS id, category_name AS name, category_key AS key, description,
              banner_image_url AS image_url, display_order
       FROM tbl_program_categories WHERE is_active = true ORDER BY display_order`
    );
    const progs = await query(
      `SELECT program_id AS id, category_id, program_name AS title, description,
              image_url, alt_text, display_order
       FROM tbl_programs WHERE is_active = true ORDER BY display_order`
    );
    const categories = cats.rows.map((cat: any) => ({
      ...cat,
      programs: progs.rows.filter((p: any) => p.category_id === cat.id),
    }));
    res.json(categories);
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/programs/category", authenticate, async (req, res) => {
  try {
    const body = z.object({ name: z.string().min(1), key: z.string().min(1) }).parse(req.body);
    const maxOrder = await query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM tbl_program_categories");
    const result = await query(
      `INSERT INTO tbl_program_categories (category_name, category_key, display_order, is_active, updated_by)
       VALUES ($1, $2, $3, true, $4)
       RETURNING category_id AS id, category_name AS name, category_key AS key, description, banner_image_url AS image_url, display_order`,
      [body.name, body.key, maxOrder.rows[0].next, req.user?.id ?? null]
    );
    res.status(201).json({ ...result.rows[0], programs: [] });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/programs/category/:id", authenticate, async (req, res) => {
  try {
    const body = z.object({ name: z.string().min(1), key: z.string().min(1) }).parse(req.body);
    const result = await query(
      `UPDATE tbl_program_categories SET category_name = $1, category_key = $2,
       updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE category_id = $4
       RETURNING category_id AS id, category_name AS name, category_key AS key, description, banner_image_url AS image_url, display_order`,
      [body.name, body.key, req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Category not found" }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/programs/category/:id", authenticate, async (req, res) => {
  try {
    await query("UPDATE tbl_programs SET is_active = false WHERE category_id = $1", [req.params.id]);
    const result = await query(
      "UPDATE tbl_program_categories SET is_active = false, updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE category_id = $2 RETURNING category_id AS id",
      [req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Category not found" }); return; }
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/programs/category/reorder", authenticate, async (req, res) => {
  try {
    const { ids } = z.object({ ids: z.array(z.number()) }).parse(req.body);
    for (let i = 0; i < ids.length; i++) {
      await query("UPDATE tbl_program_categories SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE category_id = $2", [i, ids[i]]);
    }
    res.json({ message: "Reordered" });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Reorder categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/programs/program", authenticate, async (req, res) => {
  try {
    const body = z.object({
      category_id: z.number(),
      title: z.string().min(1),
      description: z.string().optional().default(""),
      alt_text: z.string().optional().default(""),
    }).parse(req.body);
    const maxOrder = await query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM tbl_programs WHERE category_id = $1", [body.category_id]);
    const result = await query(
      `INSERT INTO tbl_programs (category_id, program_name, description, alt_text, display_order, is_active, updated_by)
       VALUES ($1, $2, $3, $4, $5, true, $6)
       RETURNING program_id AS id, category_id, program_name AS title, description, image_url, alt_text, display_order`,
      [body.category_id, body.title, body.description, body.alt_text, maxOrder.rows[0].next, req.user?.id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Create program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/programs/program/:id", authenticate, async (req, res) => {
  try {
    const body = z.object({
      title: z.string().min(1),
      description: z.string().optional().default(""),
      alt_text: z.string().optional().default(""),
    }).parse(req.body);
    const result = await query(
      `UPDATE tbl_programs SET program_name = $1, description = $2, alt_text = $3,
       updated_by = $4, updated_at = CURRENT_TIMESTAMP WHERE program_id = $5
       RETURNING program_id AS id, category_id, program_name AS title, description, image_url, alt_text, display_order`,
      [body.title, body.description, body.alt_text, req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Program not found" }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/programs/:id/image", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const uploaded = await uploadFile(`programs/program-${id}-${Date.now()}.${ext}`, req.file.buffer);
    const result = await query(
      `UPDATE tbl_program_categories SET banner_image_url = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE category_id = $3 RETURNING category_id AS id, category_name AS name, banner_image_url AS image_url`,
      [uploaded.url, req.user?.id ?? null, id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Program not found" }); return; }
    res.json({ message: "Image updated", program: result.rows[0] });
  } catch (error) {
    console.error("Update program image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/programs/program/:id", authenticate, async (req, res) => {
  try {
    const result = await query(
      "UPDATE tbl_programs SET is_active = false, updated_by = $1, updated_at = CURRENT_TIMESTAMP WHERE program_id = $2 RETURNING program_id AS id",
      [req.user?.id ?? null, req.params.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Program not found" }); return; }
    res.json({ message: "Program deleted" });
  } catch (error) {
    console.error("Delete program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Contact Info ─────────────────────────────────────────────────────────────

router.get("/contact", async (_req, res) => {
  try {
    const result = await query(
      `SELECT contact_id AS id, info_type, label, value, maps_url, is_primary, display_order
       FROM tbl_contact_info WHERE is_active = true ORDER BY display_order`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get contact info error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/contact/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = z
      .object({
        value: z.string().min(1),
        label: z.string().optional(),
        maps_url: z.union([z.string(), z.null()]).optional(),
      })
      .parse(req.body);
    const updates: string[] = ["value = $1", "updated_at = CURRENT_TIMESTAMP", "updated_by = $2"];
    const params: (string | number | null)[] = [parsed.value, req.user?.id ?? null];
    let idx = 3;
    if (parsed.label) { updates.push(`label = $${idx++}`); params.push(parsed.label); }
    if (parsed.maps_url !== undefined) {
      const url =
        parsed.maps_url === null || parsed.maps_url.trim() === ""
          ? null
          : parsed.maps_url.trim();
      updates.push(`maps_url = $${idx++}`);
      params.push(url);
    }
    params.push(id);
    const result = await query(
      `UPDATE tbl_contact_info SET ${updates.join(", ")} WHERE contact_id = $${idx}`,
      params
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Contact entry not found" });
      return;
    }
    // Re-fetch so the response always includes maps_url (and matches DB), even if RETURNING shape varies.
    const refreshed = await query(
      `SELECT contact_id AS id, info_type, label, value, maps_url, is_primary
       FROM tbl_contact_info WHERE contact_id = $1`,
      [id]
    );
    const entry = refreshed.rows[0];
    if (!entry) {
      res.status(404).json({ error: "Contact entry not found" });
      return;
    }
    res.json({
      message: "Contact info updated",
      entry: {
        id: entry.id,
        info_type: entry.info_type,
        label: entry.label,
        value: entry.value,
        maps_url: entry.maps_url ?? null,
        is_primary: entry.is_primary,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) { res.status(400).json({ error: "Invalid input" }); return; }
    console.error("Update contact info error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
