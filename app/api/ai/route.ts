import { auth } from "@/auth";
import { db } from "@/lib/db";
// import { checkAndRefreshCredits } from "@/lib/credits";
import { generateAIResponse } from "@/lib/openai";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const { text, userId } = await req.json();

        // Verify that the session user matches the requested userId for security
        if (!session?.user?.id || session.user.id !== userId) {
            return Response.json({ 
                error: "Unauthorized access" 
            }, { status: 401 });
        }

        // const user = await checkAndRefreshCredits(userId);

        // if (!user) {
        //     return Response.json({ 
        //         error: "User not found" 
        //     }, { status: 404 });
        // }

        // if (user.credits <= 0) {
        //     return Response.json({ 
        //         error: "Insufficient credits" 
        //     }, { status: 403 });
        // }

        const rewritten = await generateAIResponse(text);

        // Update credits after successful rewrite
        // await db.user.update({
        //     where: { id: userId },
        //     data: { credits: { decrement: 1 } },
        // });

        return Response.json({ 
            success: true,
            rewritten,
            // remainingCredits: user.credits - 1
        });

    } catch (error) {
        console.error('Error in rewrite API:', error);
        return Response.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}
