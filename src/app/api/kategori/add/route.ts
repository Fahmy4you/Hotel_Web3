import { verifyToken } from "@/utils/verifyToken";
import { checkRole } from "@/utils/checkRole";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkMultipleRoles } from "@/utils/checkMultiRole";

const prisma = new PrismaClient();

/**
 * @swagger
 *  tags:
 *   - name: Kategori
 *     description: Kategori management endpoints
 *
 * /kategori/add:
 *   post:
 *     summary: Add a new room category - Access Role [Admin, Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     description: This endpoint is used to add a new room category to the system.
 *     tags:
 *       - Kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: The name of the room category to be added.
 *                 example: "Deluxe Room"
 *     responses:
 *       201:
 *         description: Category successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created category.
 *                   example: 1
 *                 kategori:
 *                   type: string
 *                   description: The name of the room category.
 *                   example: "Deluxe Room"
 *       400:
 *         description: Bad request, required parameters are missing.
 *       401:
 *         description: Token not provided.
 *       403:
 *         description: Forbidden access, user does not have sufficient privileges.
 *       500:
 *         description: Internal server error, failed to create category.
 */

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (payload instanceof NextResponse) return payload;

  const isAllowedRole = checkMultipleRoles(payload, [1, 2]);
  if (isAllowedRole) return isAllowedRole;

  const data = await request.json();

  if (!data.nama) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.kategoriKamar.create({
      data: {
        kategori: data.nama,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create kategori" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
