import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/utils/hashingPassword";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Me
 *     description: Get info of the logged-in user endpoints
 *
 * /me/edit:
 *   put:
 *     tags: [Me]
 *     summary: Update user profile - Access Role [Admin, Pemilik Hotel, Tamu]
 *     description: Update authenticated user's profile information (partial update allowed).
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               no_wa:
 *                 type: string
 *                 example: "6281234567890"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     no_wa:
 *                       type: string
 *                       example: "6281234567890"
 *       400:
 *         description: At least one field must be provided
 *       401:
 *         description: Unauthorized or Token invalid
 *       500:
 *         description: Internal server error
 */


export async function PUT(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Token not provided" }, { status: 401 });
  }

  if (!process.env.JWT_ACCSESS_TOKEN) {
    throw new Error("JWT_ACCSESS_TOKEN is not defined in environment variables");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCSESS_TOKEN) as { id: number; email: string };
  } catch (error) {
    return NextResponse.json({ message: "Token expired or Invalid" }, { status: 401 });
  }

  const userId = payload.id;
  const { name, email, password, no_wa } = await request.json();

  if (!name && !email && !password && !no_wa) {
    return NextResponse.json({ message: "At least one field must be provided" }, { status: 400 });
  }

  try {
    let hashedPassword: string | undefined = undefined;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        nama: name || undefined,
        email: email || undefined,
        password: hashedPassword,
        no_wa: no_wa || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        no_wa: user.no_wa,
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
