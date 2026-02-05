import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.CHAT_MODEL || "gpt-4.1-mini";


interface AskChurchAssistantParams {
  question: string;
}

export async function askChurchAssistant(
  params: AskChurchAssistantParams
): Promise<string> {
  const { question } = params;

  const prompt = `
You are a church management assistant.
Provide your answer in TWO languages:

1) English (main response)
2) Portuguese (Brazil) – translated version

Make the Portuguese version faithful to the English version.

User question: ${question}
`;

  const response: any = await client.responses.create({
    model: MODEL,
    input: prompt,
  });

  // Try common locations for returned text; fallback to JSON string of the response
  const text =
    response.output_text ??
    response.output?.[0]?.content?.find((c: any) => c.type === "text")?.text ??
    response.output?.[0]?.content?.[0]?.text ??
    JSON.stringify(response);

    return text;
  }
