import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "process";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 * 
 * /api/auth/register:
 *   post:
 *     tags: [Auth]  # <-- Kunci utama: tambahkan ini
 *     summary: Register a new user
 *     description: Register a new user with email, password, name, and phone number.
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
 *               name:
 *                 type: string
 *               no_wa:
 *                 type: string
 *               role_id:
 *                 type: integer
 *             required:
 *               - email
 *               - password
 *               - name
 *               - no_wa
 *               - role_id
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     no_wa:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *                 token:
 *                   type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */


const hashPassword = async (password: string) => {
    if (!env.KEY_HASHING) {
        throw new Error("HASH_SECRET is not defined in the environment variables.");
    }
    const hmacSha256 = crypto.createHmac('sha256', env.KEY_HASHING);
    hmacSha256.update(password);
    const hashedPassword = hmacSha256.digest('hex');
    return hashedPassword;
}

export const registerUser = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
    return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        nama: data.name,
        no_wa: data.no_wa,
        role_id: data.role_id,
      },
    });

    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      env.JWT_SECRET,
      {
        expiresIn: "24h", // Token expires in 24 hours ( 1 Hari )
      }
    );

    return NextResponse.json({ message: "User berhasil terdaftar", user, token }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
