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
 * /hotels/details/myhotels/{id_hotel}:
 *   get:
 *     tags: [Hotels]
 *     summary: Get hotel by ID
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
    const { id_hotel } = await params;
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    if (!id_hotel) {
        return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
    }

    if (isNaN(Number(id_hotel))) {
        return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
    }

    const secretKey = process.env.JWT_ACCSESS_TOKEN;
    if (!secretKey) {
        return NextResponse.json({ error: "JWT_SECRET is not defined in the environment variables." }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string, role: string };
        const userId = Number(decoded.id);
        const roleId = Number(decoded.role);
        if (roleId !== 1) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
            const id_hotel = params.id_hotel;
            
        if (!id_hotel) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const getDetailHotel = await prisma.hotel.findUnique({
            where: { id: Number(id_hotel) },
        });

        if (!getDetailHotel || getDetailHotel.user_id !== userId || !getDetailHotel) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }

        return NextResponse.json(getDetailHotel, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error get hotel' }, { status: 500 });
    }
}