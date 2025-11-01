import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      db.chat.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.chat.count({ where: { userId: session.user.id } }),
    ]);

    return Response.json({ success: true, chats, total });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
