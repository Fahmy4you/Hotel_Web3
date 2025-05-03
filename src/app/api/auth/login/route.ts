import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { validateEmailFormat } from "@/utils/validateEmail";
import { hashPassword } from "@/utils/hashingPassword";
import { NextRequest, NextResponse } from "next/server";
import { Address, isAddress, verifyMessage } from "viem";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 * 
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login to get a Token
 *     description: Login with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Email and Password required
 *       404:
 *         description: Cannot found User
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

export async function POST(request: NextRequest) {
  try {
    const { wallet_address, message, signature } = await request.json();

    // if(!message || !wallet_address || !signature) return NextResponse.json({ message: "Missing Require Parameter" }, { status: 400 });

    if (!wallet_address || !isAddress(wallet_address)) return NextResponse.json({ message: "Address Is Required And Valid Address" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { wallet_address },
    });

    if(!user) return NextResponse.json({message: "User Not Found"}, {status: 400});

    const nonce = await prisma.nonce.findFirst({
      where: {
        userId: user.id,
        expiredAt: {gt: new Date()} // belum expired
      },
      orderBy: {createdAt: 'desc'}
    });

    if(!nonce) return NextResponse.json({message: "Nonce expired or not found"}, {status: 400});

    // const expectedMessage = `Login to MydApp FK HOTEL WEB3 \nNonce : ${nonce.value}`;

    // const isValid = await verifyMessage({
    //   address: wallet_address as Address,
    //   message: expectedMessage,
    //   signature
    // })

    // if(!isValid) return NextResponse.json({ message: "Invalid signature" }, { status: 401 })

    // Delete nonce supaya ga bisa dipakai ulang
    await prisma.nonce.delete({ where: { id: nonce.id } })

    const accessToken = await generateAccessToken({id: user.id, wallet_address: user.wallet_address, role: user.role_id});
    const refreshToken = await generateRefreshToken({id: user.id, wallet_address: user.wallet_address, role: user.role_id});

    const response = NextResponse.json({
      message: "Login successful",
      accessToken,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
