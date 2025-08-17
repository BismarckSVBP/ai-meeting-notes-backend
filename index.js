import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import express from "express";
import cors from "cors";
import summaryRoutes from "./routes/summaryRoutes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api", summaryRoutes);

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`✅ API listening on ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();
