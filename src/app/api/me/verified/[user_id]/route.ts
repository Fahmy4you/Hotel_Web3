import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { user_id: number } }) {
    const userId = params.user_id;

    if (isNaN(userId)) {
        return NextResponse.json(
            { error: "Invalid user ID." },
            { status: 400 }
        );
    }

    try {
        const verification = await prisma.verified_Account.findUnique({
            where: {
                user_id: Number(userId),
            },
            select: {
                Email_verified: true,
                NoWa_verified: true,
            },
        });
        
        if (!verification) {
            return NextResponse.json({
                Email_verified: false,
                NoWa_verified: false,
            });
        }
        
        return NextResponse.json(verification);

    } catch (error) {
        console.error("Error fetching verification status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}