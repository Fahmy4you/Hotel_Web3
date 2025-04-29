import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

/**
 * @swagger 
 * /upload/my-profile-pict:
 *   post:
 *     tags: [Me]
 *     summary: Post a new profile picture - Access Role [Tamu, Admin, Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     description: Post a new profile picture base on logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the profile picture.
 *             required:
 *               - file
 *     responses:
 *       201:
 *         description: Successfully Upload Profile Picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Success Add Profile Pict'
 *                 profilePicture:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     user_id:
 *                       type: number
 *                       example: 3
 *                     images:
 *                       type: string
 *                       example: '1628232768-image.jpg'
 *       400:
 *         description: Invalid input or no file uploaded
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }
  
  const uploadFolder = path.join(process.cwd(), 'public/uploads/profile_pict');

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  const formData = await req.formData();
  
  const secretKey = process.env.JWT_ACCSESS_TOKEN;
  if (!secretKey) {
    return NextResponse.json({ error: "JWT_SECRET is not defined in the environment variables." }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: string };
    const userId = Number(decoded.id);
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFileName = Date.now() + '-' + file.name;
    const filePath = path.join(uploadFolder, newFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const existingProfilePicture = await prisma.profilePict.findFirst({
      where: {
        user_id: userId
      }
    });

    let profilePicture;
    let message;

    if (existingProfilePicture) {
      try {
        const oldImagePath = path.join(uploadFolder, existingProfilePicture.images);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error('Error deleting old profile picture:', err);
      }

      profilePicture = await prisma.profilePict.update({
        where: {
          id: existingProfilePicture.id
        },
        data: {
          images: newFileName,
        },
      });
      message = 'Success Updated Profile Pict';
    } else {
      profilePicture = await prisma.profilePict.create({
        data: {
          user_id: userId,
          images: newFileName,
        },
      });
      message = 'Success Add Profile Pict';
    }

    return NextResponse.json({
      message: message,
      profilePicture: profilePicture
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}