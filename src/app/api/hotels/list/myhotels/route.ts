import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/verifyToken";
import { checkRole } from "@/utils/checkRole";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Hotels
 *     description:  Hotels management endpoints
 * 
 * /hotels/list/myhotels:
 *   get:
 *     tags: [Hotels]
 *     summary: Retrieve list of hotels of the logged-in user - Access Role [Pemilik Hotel]
 *     security:
 *      - Bearer: []
 *     description: Get the list of all hotels with images and related details.
 *     responses:
 *       200:
 *         description: this is a list of hotels of the logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama_hotel:
 *                     type: string
 *                   desk:
 *                     type: string
 *                   lokasi:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Error fetching hotels
 *       401:
 *         description: Unauthorized access
 *       400:
 *          description: Bad request
 *       403:
 *         description: Forbidden access
 */

export async function GET(request: NextRequest) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (payload instanceof NextResponse) return payload;

    try {
        const userId = payload.id;
        const roleId = Number(payload.role);
       
        const isPemilikHotel = checkRole(payload, 1);
        if (isPemilikHotel) return isPemilikHotel;

        const hotels = await prisma.hotel.findMany({
            where: {
                user_id: Number(userId),
            },
        });

        return NextResponse.json({
            hotels: hotels.map((hotel) => ({
                id: hotel.id,
                nama_hotel: hotel.nama_hotel,
                lokasi: hotel.lokasi,
                images: hotel.images,
            })),
        }, { status: 200 });
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}