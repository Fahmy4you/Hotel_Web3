import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_ACCSESS_TOKEN;

/**
 * @swagger
 * tags:
 *   - name: Hotels
 *     description: Hotel management endpoints
 * 
 * /hotels/details/myhotels/{id_hotel}:
 *   get:
 *     tags: [Hotels]
 *     summary: Get hotel by ID - Access Role [Pemilik Hotel]
 *     security:
 *      - Bearer: []
 *     description: Retrieve hotel information by its ID
 *     parameters:
 *       - in: path
 *         name: id_hotel
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the hotel to retrieve
 *     responses:
 *       200:
 *         description: Hotel data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hotel:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: 'Grand Hotel'
 *                     description:
 *                       type: string
 *                       example: 'A luxury hotel in downtown'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid hotel ID format
 *       404:
 *         description: Hotel not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden access
 *       500:
 *         description: Internal server error
 */

export async function GET(request: NextRequest, { params }: { params: { id_hotel: string } }) {
  const { id_hotel } = params;

  // Validasi token
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  if (!JWT_SECRET) {
    console.error("JWT secret not defined in environment");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  // Validasi ID
  const hotelId = Number(id_hotel);
  if (!id_hotel || isNaN(hotelId)) {
    return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const userId = Number(decoded.id);
    const isAdmin = Number(decoded.role) === 1;

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.user_id !== userId) {
      return NextResponse.json({ error: "Hotel not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ hotel }, { status: 200 });

  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json({ error: "Failed to retrieve hotel" }, { status: 500 });
  }
}
