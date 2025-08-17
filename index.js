import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import summaryRoutes from "./routes/summaryRoutes.js";

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ✅ Routes
app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api", summaryRoutes);

// ✅ Connect DB (only once per cold start)
let isConnected = false;
async function initDB() {
  if (!isConnected) {
    await connectDB(process.env.MONGODB_URI);
    isConnected = true;
  }
}
await initDB();

// ✅ For Vercel
export default app;

// ✅ For local dev (only runs when `node index.js`)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`✅ API listening on port ${PORT}`));
}
