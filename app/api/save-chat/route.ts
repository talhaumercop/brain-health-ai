// app/api/save-chat/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";

type SaveBody = {
  question: string;
  answer: string;
  userId: string;
  zone?: string | null;
  mindset_fix?: string | null;
  motivational_closing?: string | null;
  score?: number | null;
};

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Read incoming JSON
    const body = (await req.json()) as SaveBody;

    // Basic validation
    if (!body?.question || !body?.answer || !body?.userId) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify user identity
    if (!session?.user?.id || session.user.id !== body.userId) {
      return Response.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    // Create chat record (store extra fields if present)
    const chat = await db.chat.create({
      data: {
        userId: body.userId,
        question: body.question,
        answer: body.answer,
        zone: body.zone ?? null,
        score: body.score ?? null,
        // // @ts-ignore
        // motivation_closing: body.motivational_closing ?? null,
        // mindset_fix: body.mindset_fix ?? null,
      },
    });

    // If you want to store mindset_fix and motivational_closing later,
    // you can add JSON column or separate model; currently we keep them out of main fields
    // (since schema doesn't have them). If you want to store them, you can
    // put them into a JSON string in `answer` or extend schema.

    return Response.json({ success: true, chat });
  } catch (error) {
    console.error("Error saving chat:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
