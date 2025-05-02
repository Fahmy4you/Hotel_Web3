import { NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/hashingPassword";
import jwt from "jsonwebtoken";
import { env } from "process";
import { checkEmailUsed } from '@/utils/checkEmailUsed';
import { validateEmailFormat } from '@/utils/validateEmail';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 * 
 * /auth/register:
 *   post:
 *     tags: [Auth]
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


export async function POST(request: Request) {
  try {
    const data = await request.json();

    const isUsedEmail = await checkEmailUsed(data.email);
    if (isUsedEmail) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const isValidEmailFormat = validateEmailFormat(data.email);
    if (!isValidEmailFormat) {
      return NextResponse.json(
        { message: "Invalid emaial format" },
        { status: 400 }
      );
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
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      { 
        message: "User berhasil terdaftar", 
        user: {
          id: user.id,
          email: user.email,
          name: user.nama,
          no_wa: user.no_wa,
          role_id: user.role_id
        },
        token 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}