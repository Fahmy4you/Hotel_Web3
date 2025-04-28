import jwt from 'jsonwebtoken';
import { generateAccessToken } from '@/utils/refreshToken';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using a valid refresh token
 *     description: This endpoint allows a user to get a new access token using a valid refresh token from the cookies.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your-refresh-token-value-here"
 *     responses:
 *       200:
 *         description: Successfully generated a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "newly-generated-access-token"
 *       401:
 *         description: Refresh token not provided or invalid
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */


export function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const refresh = request.cookies.get("refreshToken")?.value;
    if (!refresh) {
        return NextResponse.json({ message: "Refresh token not provided" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(refresh, process.env.JWT_REFRESH as string) as { id: number; email: string, role: string };
        const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });
        return NextResponse.json({ accessToken }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

}