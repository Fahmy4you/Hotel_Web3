import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/utils/hashingPassword';
import { data } from 'framer-motion/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_ACCSESS_TOKEN;

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Users management endpoints
 * 
 * /users/delete/{user_id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user - Access Role [Admin Only]
 *     description: Update an existing user account. Only accessible by admin users (role_id = 1).
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user to Delete
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     no_wa:
 *                       type: string
 *                       example: "6281234567890"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     role_id:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:00:00Z"
 *       400:
 *         description: Bad request (e.g., no fields provided or invalid user_id)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


export async function DELETE(request: NextRequest, { params }: { params: { user_id: string } }) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Token not provided' }, { status: 401 });
    }

    if (!JWT_SECRET) {
        console.error('JWT secret not defined in environment');
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET) as { id: number; role: number };
    } catch (error) {
        return NextResponse.json({ message: 'Token expired or invalid' }, { status: 401 });
    }

    // Hanya role admin yang boleh akses
    if (Number(payload.role) !== 2) {
        return NextResponse.json({ message: 'Access denied. Admins only.' }, { status: 403 });
    }

    const userIDToDelete = parseInt(params.user_id);
    if (isNaN(userIDToDelete)) {
        return NextResponse.json({ message: 'Invalid user_id parameter' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
        where: { id: userIDToDelete },
    });

    if (!existingUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    try {
        await prisma.user.update({
            where: { id: userIDToDelete},
            data : {
                
                deletedAt: new Date(),
            }
        });

        return NextResponse.json({
            message: 'User Delete successfully',
            user: existingUser,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
