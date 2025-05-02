import { verifyToken } from "@/utils/verifyToken";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkMultipleRoles } from "@/utils/checkMultiRole";
import { checkIsNumber } from "@/utils/checkIsNumber";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Kategori
 *     description: Kategori management endpoints
 *
 * /kategori/delete/{id_kategori}:
 *   delete:
 *     tags: [Kategori]
 *     summary: Delete kategori - Access Role [Admin, Pemilik Hotel]
 *     description: Delete an existing user account.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name : id_kategori
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the kategori to Delete
 *     responses:
 *       200:
 *         description: Kategori successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kategori deleted successfully
 *                 kategoriKamar:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     kategori:
 *                       type: string
 *                       example: "Deluxe Room"
 *       400:
 *         description: Bad request (e.g., no fields provided or invalid kategori_id)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       404:
 *         description: Kategori not found
 *       500:
 *         description: Internal server error
 */

export async function DELETE(
  request: Request,
  { params }: { params: { id_kategori: string } }
) {
  const idKategori = await params;
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (payload instanceof NextResponse) return payload;

  const isAllowedRole = checkMultipleRoles(payload, [1, 2]);
  if (isAllowedRole) return isAllowedRole;

  const stringKategoriID = idKategori.id_kategori;

  if (!checkIsNumber(stringKategoriID)) {
    return NextResponse.json(
      { message: "kategori_id must be a number" },
      { status: 400 }
    );
  }

  const kategoriToDelete = Number(idKategori.id_kategori);

  const existingKategori = await prisma.kategoriKamar.findFirst({
    where: {
      id: kategoriToDelete,
    },
  });

  if (!existingKategori) {
    return NextResponse.json({ error: "Kategori not found" }, { status: 404 });
  }

  try {
    const result = await prisma.kategoriKamar.delete({
      where: {
        id: kategoriToDelete,
      },
    });
    return NextResponse.json({
      result,
      message: "Kategori deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete kategori" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
