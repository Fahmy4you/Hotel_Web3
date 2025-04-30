import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/verifyToken';
import { checkRole } from '@/utils/checkRole';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Users management endpoints
 * 
 * /users/get-all:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve list of all users - Access Role [Admin]
 *     security:
 *       - Bearer: []
 *     description: Get the list of all users, with optional search by name (case-insensitive).
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search query to filter users by name
 *     responses:
 *       200:
 *         description: A list of Users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama:
 *                     type: string
 *                   no_wa:
 *                     type: string
 *                   email:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *                   role_id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                   deletedAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access
 *       500:
 *         description: Internal server error
 */

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (payload instanceof NextResponse) return payload;

  // let payload;
  // try {
  //   payload = jwt.verify(token, process.env.JWT_ACCSESS_TOKEN) as { id: number; role: string };
  // } catch (error) {
  //   return NextResponse.json({ message: "Token expired or Invalid" }, { status: 401 });
  // }

  const isAdmin = checkRole(payload, 2);
  if (isAdmin) return isAdmin;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const result = await prisma.user.findMany({
      where: {
        nama: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
