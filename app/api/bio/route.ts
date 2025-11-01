import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { bio } = await req.json();

    if (!session?.user?.id) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { bio },
    });

    return Response.json({ success: true, message: "Bio updated successfully" });
  } catch (error) {
    console.error("Error updating bio:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
