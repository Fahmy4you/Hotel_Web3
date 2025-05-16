import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import generateRandomUserName from "@/utils/generateRandomUsername";
import { generateRefreshToken } from "@/utils/jwt";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    const nameDefaultUser = generateRandomUserName();
    const { wallet_address } = await request.json();

    if (!wallet_address || !isAddress(wallet_address)) return NextResponse.json({ message: "Address Is Required And Valid Address" }, { status: 400 });

    let user = await prisma.user.findUnique({
      where: { wallet_address },
    });

    
    if (!user) {
        user = await prisma.user.create({ data: { wallet_address, role_id: 1, nama: nameDefaultUser } })
      }

    const refreshToken = await generateRefreshToken({id: user.id, wallet_address: user.wallet_address, role: user.role_id});

    const response = NextResponse.json({
      message: "Login successful",
    });

     response.cookies.set('refreshToken', refreshToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       path: '/',
       maxAge: 7 * 24 * 60 * 60, 
     });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
