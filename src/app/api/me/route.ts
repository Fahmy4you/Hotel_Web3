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
        const user = await prisma.user.findUnique({ 
            where: { wallet_address : tokenIsVerified.wallet_address },
            include : {
                role : true
            }
         });
         const responseParsed = { ...tokenIsVerified,
            role_id : user?.role.id,
            nama_user : user?.nama,
            role: user?.role.role,
            profile_pict : user?.profile_pict,
            email : user?.email,
            wallet_address : user?.wallet_address,
            id : user?.id,
            no_wa : user?.no_wa,
            join_date : user?.createdAt};
            //console.log("response api", responseParsed);
        return NextResponse.json(responseParsed);
    } catch (error : any) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}