import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/hashingPassword";
import { NextRequest, NextResponse } from "next/server";

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
 *     description: Logn with email and password.
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
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Email and Password required
 *       404:
 *         description: Cannot found User
 *       405:
 *        description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "Cannot found user data" }, { status: 404 });
        }

        const isPasswordValid = await hashPassword(password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        return NextResponse.json({ message: "Login successful", token }, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}