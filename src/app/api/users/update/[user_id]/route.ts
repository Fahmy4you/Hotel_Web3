import jwt from 'jsonwebtoken';
import { validateEmailFormat } from '@/utils/validateEmail';
import { checkEmailUsed } from '@/utils/checkEmailUsed';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRole } from '@/utils/checkRole';
import { hashPassword } from '@/utils/hashingPassword';
import { verifyToken } from '@/utils/verifyToken';
import { validatorID } from '@/utils/validatorId';

const prisma = new PrismaClient();
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Users management endpoints
 * 
 * /users/update/{user_id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user - Access Role [Admin Only]
 *     description: Update an existing user account. Only accessible by admin.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role_id:
 *                  type: integer
 *                  example: 1
 *               is_active:
 *                  type: boolean
 *                  example: true
 *               no_wa:
 *                 type: string
 *                 example: "6281234567890"
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


export async function PUT(request: NextRequest, { params }: { params: { user_id: string } }) {
    const userId = await params;
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Token not provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (payload instanceof NextResponse) return payload;
    
    // Hanya role admin yang boleh akses
    const isAdmin = checkRole(payload, 2);
    if (isAdmin) return isAdmin;

    // Validasi user_id
    const isValidUserId = validatorID(userId.user_id);
    if (isValidUserId instanceof NextResponse) return isValidUserId;
        
    const existingUser = await prisma.user.findUnique({
        where: { id: isValidUserId },
    });

    if (!existingUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { name, email, password, no_wa, is_active, role_id } = await request.json();

    if (![name, email, password, no_wa, is_active, role_id].some(v => v !== undefined)) {
        return NextResponse.json({ message: 'At least one field must be provided' }, { status: 400 });
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
        return NextResponse.json({ message: 'is_active must be a boolean' }, { status: 400 });
    }

    if (role_id !== undefined && typeof role_id !== 'number') {
        return NextResponse.json({ message: 'role_id must be a number' }, { status: 400 });
    }

    const isValidEmailFormat = validateEmailFormat(email);
    if (!isValidEmailFormat) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    } 

    const isUsedEmail = await checkEmailUsed(email, true, isValidUserId);
    if (isUsedEmail) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    let hashedPassword: string | undefined = undefined;
    if (password) {
        try {
            hashedPassword = await hashPassword(password);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Error hashing password' }, { status: 500 });
        }
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: isValidUserId },
            data: {
                nama: name || undefined,
                email: email || undefined,
                password: hashedPassword,
                no_wa: no_wa || undefined,
                role_id: role_id || undefined,
                is_active: is_active,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({
            message: 'User updated successfully',
            user: updatedUser,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

