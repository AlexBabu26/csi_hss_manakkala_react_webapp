import express from "express";
import cors from "cors";
import compression from "compression";
import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import uploadRoutes from "./routes/upload";
import eventRoutes from "./routes/events";
import inquiryRoutes from "./routes/inquiries";
import mediaRoutes from "./routes/media";
import { loadEnv } from "./env";

loadEnv();

export const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/media", mediaRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
