import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateAIResponse(text: string) {
  const prompt = `Provide a thoughtful and insightful analysis of the following statement, focusing on its deeper cognitive and emotional implications. Keep the tone reflective and slightly analytical. Statement: "${text}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
