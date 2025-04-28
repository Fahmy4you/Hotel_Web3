import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
 *     summary: Retrieve list of hotels of the logged-in user
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

    const secretKey = process.env.JWT_ACCSESS_TOKEN;
    if (!secretKey) {
        return NextResponse.json({ error: "JWT_SECRET is not defined in the environment variables." }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string, role: string };
        const userId = decoded.id;
        const roleId = Number(decoded.role);
        console.log("Result :", roleId, userId);

        if (roleId !== 1) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

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