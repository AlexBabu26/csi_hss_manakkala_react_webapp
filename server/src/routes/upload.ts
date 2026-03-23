import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { uploadFile } from "../services/b2Storage";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const result = await uploadFile(req.file.originalname, req.file.buffer);
    res.json({ message: "File uploaded successfully", url: result.url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

export default router;
