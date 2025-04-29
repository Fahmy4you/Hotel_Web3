import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Hotels
 *     description: Hotel management endpoints
 * 
 * /hotels/myhotels/delete/{id_hotel}:
 *   delete:
 *     tags: [Hotels]
 *     summary: Delete a hotel by ID - Access Role [Pemilik Hotel]
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

export async function DELETE(req: NextRequest, { params }: { params: { id_hotel: string } }) {
    const { id_hotel } = await params;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    if (!id_hotel) {
        return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCSESS_TOKEN as string) as { id: number, role: string };
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (isNaN(Number(id_hotel))) {
        return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
    }

    if (Number(decoded.role) !== 1 ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isNaN(Number(decoded.id))) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const existsHotel = await prisma.hotel.findFirst({
        where: { id: Number(id_hotel), deletedAt: null },
    });

    if (!existsHotel) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        
    }
    await prisma.hotel.update({
        where: { id: Number(id_hotel) },
        data: {
            deletedAt: new Date(),
        }
    });
    
    if (existsHotel.user_id !== Number(decoded.id) || !existsHotel) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ ...existsHotel, message: "Hotel deleted successfully" }, { status: 200 });
}