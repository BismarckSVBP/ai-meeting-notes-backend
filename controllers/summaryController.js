import { Summary } from "../models/Summary.js";
import { generateSummary } from "../services/groqService.js";
import { sendSummaryEmail } from "../services/emailService.js";


function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function createSummary(req, res) {
  try {
    const { text, prompt, model = "llama-3.3-70b-versatile" } = req.body;
    if (!text || !prompt)
      return res.status(400).json({ error: "text and prompt required" });

    const summaryText = await generateSummary({
      text,
      prompt,
      model,
      apiKey: process.env.GROQ_API_KEY,
    });

    const doc = await Summary.create({
      originalText: text,
      prompt,
      model,
      summary: summaryText,
    });

    res.json({ id: doc._id.toString(), summary: doc.summary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "summarize_failed" });
  }
}

export async function updateSummary(req, res) {
  try {
    const { summary } = req.body;
    await Summary.findByIdAndUpdate(req.params.id, { summary });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "update_failed" });
  }
}

export async function getSummary(req, res) {
  try {
    const doc = await Summary.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "not_found" });
    res.json({
      id: doc._id.toString(),
      originalText: doc.originalText,
      prompt: doc.prompt,
      summary: doc.summary,
      createdAt: doc.createdAt,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "fetch_failed" });
  }
}



import { summaryTemplate } from "../templates/emailTemplates.js";

function extractActionItems(summary = "") {
  const matches = summary.match(/- (.+)/g);
  return matches ? matches.map((m) => m.replace("- ", "")) : [];
}

export async function shareSummary(req, res) {
  try {
    const { id, recipients } = req.body;
    if (!id || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "id and recipients[] required" });
    }

    const doc = await Summary.findById(id);
    if (!doc) return res.status(404).json({ error: "not_found" });

    const subject = "📋 Meeting Summary - " + (doc.prompt || "AI Notes");
    const text = doc.summary || "No summary available.";
    console.log("bossdk", text);
    console.log("📌 doc.summary before template:", doc.summary);
    console.log("📌 text before template:", text);
   
    const html = summaryTemplate({
      title: "Meeting Summary",
      transcriptName: doc.prompt || "Transcript",
      summary: text,
      actionItems: extractActionItems(text),
    });

 
    await sendSummaryEmail({ to: recipients.join(","), subject, text, html });

    doc.recipients = recipients;
    doc.emailedAt = new Date();
    await doc.save();

    res.json({ ok: true });
  } catch (e) {
    console.error("❌ Email share failed:", e);
    res.status(500).json({ error: "share_failed" });
  }
}
