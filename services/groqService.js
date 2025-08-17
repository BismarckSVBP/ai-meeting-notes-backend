import Groq from "groq-sdk";

export async function generateSummary({ text, prompt, model, apiKey }) {
  const groq = new Groq({ apiKey });

  const system =
    "You are a helpful assistant that produces concise, well-structured summaries. Use plain text with clear headings and bullet points when appropriate.";

  const user = `
TRANSCRIPT:
${text}

INSTRUCTION:
${prompt}

FORMAT:
- Use concise bullets and short paragraphs.
- Include an "Action Items" section if relevant.
- Avoid hallucinations; only use info from transcript.
`;

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
    max_tokens: 1200,
  });

  return (
    completion.choices?.[0]?.message?.content?.trim() || "No summary generated."
  );
}
