import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    originalText: { type: String, required: true },
    prompt: { type: String, required: true },
    model: { type: String, default: "llama-3.3-70b-versatile" }, 
    summary: { type: String, required: true },
    recipients: [String],
    emailedAt: Date,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Summary = mongoose.model("Summary", SummarySchema);
