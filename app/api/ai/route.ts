import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateAIResponse } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { text, userId } = await req.json();

    if (!session?.user?.id || session.user.id !== userId) {
      return Response.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    // Generate structured response
    const insight = await generateAIResponse(text, user?.bio || undefined);

    // Save to DB as usual (you can add a new JSON column later for insights)
    const chat = await db.chat.create({
      data: {
        userId,
        question: text,
        answer: JSON.stringify(insight, null, 2),
      },
    });

    return Response.json({ success: true, insight, chat });
  } catch (error) {
    console.error("Error in AI route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

