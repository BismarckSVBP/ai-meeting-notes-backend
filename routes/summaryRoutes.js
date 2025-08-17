import { Router } from "express";
import {
  createSummary,
  updateSummary,
  getSummary,
  shareSummary,
} from "../controllers/summaryController.js";

const router = Router();

router.post("/summarize", createSummary);
router.put("/summaries/:id", updateSummary);
router.get("/summaries/:id", getSummary);
router.post("/share", shareSummary);

export default router;
