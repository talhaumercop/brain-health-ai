// app/api/user/bio/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { bio: true },
    });

    return Response.json({ success: true, bio: user?.bio ?? null });
  } catch (err) {
    console.error("Error fetching user bio:", err);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
