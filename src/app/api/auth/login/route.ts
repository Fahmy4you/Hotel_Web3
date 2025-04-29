import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/hashingPassword";
import { NextRequest, NextResponse } from "next/server";

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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Cannot found user data" }, { status: 404 });
    }

    const hashedInputPassword = await hashPassword(password);

    if (hashedInputPassword !== user.password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role_id },
      process.env.JWT_ACCSESS_TOKEN || (() => { throw new Error("JWT_ACCSESS_TOKEN is not defined"); })(),
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role_id },
      process.env.JWT_REFRESH || (() => { throw new Error("JWT_REFRESH is not defined"); })(),
      { expiresIn: "7d" }
    );

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
