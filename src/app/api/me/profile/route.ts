import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Me
 *     description: Get info of the logged-in user endpoints
 * 
 * /me/profile:
 *   get:
 *     tags: [Me]
 *     summary: information of the logged-in user - Access Role [Tamu, Admin, Pemilik Hotel]
 *     security:
 *      - Bearer: []
 *     description: Get the profile based on the JWT token.
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: John Doe
 *       401:
 *         description: Unauthorized access - token is missing or invalid
 *       500:
 *         description: Internal server error
 */


export async function GET(request: NextRequest) {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ message: "Token not provided" }, { status: 401 });
    }

    const decode = verifyToken(token);

    if (!decode || typeof decode === "string" || !("id" in decode)) {
        return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(decode.id) },
            select: {
                id: true,
                email: true,
                nama: true,
                no_wa: true,
                role_id: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}