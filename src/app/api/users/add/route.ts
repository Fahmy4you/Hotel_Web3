import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/utils/hashingPassword';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Users management endpoints - Only Admin can Access this endpoints
 * 
 * /users/add:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a new user - Access Role [Admin]
 *     description: Create a new user account. Only accessible by admin users.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - no_wa
 *               - password
 *               - role_id
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               no_wa:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nama:
 *                   type: string
 *                 email:
 *                   type: string
 *                 no_wa:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *                 role_id:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 */


export async function POST(request: NextRequest) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    if (!process.env.JWT_ACCSESS_TOKEN) {
        throw new Error("JWT_ACCSESS_TOKEN is not defined in environment variables");
      }
    
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_ACCSESS_TOKEN) as { id: number; role: string };
      } catch (error) {
        return NextResponse.json({ message: "Token expired or Invalid" }, { status: 401 });
      }

        const isAdmin = Number(payload.role) === 2;

      if (!isAdmin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      const data = await request.json();

      try {
        const result = await prisma.user.create({
            data: {
                nama: data.nama,
                email: data.email,
                no_wa: data.no_wa,
                password: await hashPassword(data.password),
                role_id: data.role_id,
            },
        });
        return NextResponse.json(result, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
}