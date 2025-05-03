import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/utils/jwt";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tokenIsVerified = await verifyRefreshToken(token);
        const user = await prisma.user.findUnique({ where: { wallet_address : tokenIsVerified.wallet_address } });
        return NextResponse.json(user);
    } catch (error : any) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}