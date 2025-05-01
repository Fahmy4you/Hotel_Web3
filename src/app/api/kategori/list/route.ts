import { verifyToken } from "@/utils/verifyToken";
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
 * /kategori/list:
 *   get:
 *     summary: Get all room category - Access Role [Admin, Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Kategori
 *     responses:
 *       201:
 *         description: successfully get all kategori
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

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (payload instanceof NextResponse) return payload;

  const isAllowedRole = checkMultipleRoles(payload, [1, 2]);
  if (isAllowedRole) return isAllowedRole;

  try {
    const result = await prisma.kategoriKamar.findMany();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get all kategori" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
