
import { marked } from "marked";

export function summaryTemplate({ title, transcriptName, summary, actionItems = [] }) {
  const htmlSummary = summary
    ? marked.parse(summary)
    : "<p>No summary available.</p>";

  console.log("📩 summaryTemplate received:", { summary, actionItems });

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Roboto, Arial, sans-serif;
          line-height: 1.6;
          background: #f0f2f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 650px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 12px;
          padding: 25px 30px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
          border: 1px solid #e0e0e0;
        }
        h1 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 12px;
          text-align: center;
        }
        h2 {
          color: #34495e;
          font-size: 18px;
          margin-top: 20px;
          border-left: 4px solid #3498db;
          padding-left: 10px;
        }
        p, li {
          color: #444;
          font-size: 15px;
        }
        ul {
          padding-left: 20px;
        }
        ul li {
          margin-bottom: 6px;
        }
        .transcript {
          background: #f9f9f9;
          border-left: 4px solid #2ecc71;
          padding: 8px 12px;
          margin: 12px 0;
          font-size: 14px;
          color: #2d3436;
        }
        .summary-box {
          background: #ecf5ff;
          border: 1px solid #b3d8ff;
          border-radius: 8px;
          padding: 15px;
          margin-top: 10px;
        }
        .actions-box {
          background: #fef9e7;
          border: 1px solid #f9e79f;
          border-radius: 8px;
          padding: 15px;
          margin-top: 10px;
        }
        .actions-box ul li::before {
          content: "✅ ";
          color: #27ae60;
        }
        .footer {
          margin-top: 25px;
          font-size: 12px;
          color: #777;
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📋 ${title}</h1>
        ${
          transcriptName
            ? `<div class="transcript"><strong>Transcript:</strong> ${transcriptName}</div>`
            : ""
        }

        <h2>Summary</h2>
        <div class="summary-box">
          ${htmlSummary}
        </div>

        ${
          actionItems?.length
            ? `
        <h2>Action Items</h2>
        <div class="actions-box">
          <ul>
            ${actionItems.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>` : ""
        }

        <div class="footer">
          <p>✨ Generated automatically by <strong>AI Notes</strong></p>
        </div>
      </div>
    </body>
  </html>
  `;
}
