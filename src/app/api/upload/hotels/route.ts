import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
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
 * /upload/hotels:
 *   post:
 *     tags: [Hotels]
 *     summary: Create a new Hotel data - Access Role [Admin, Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: nama_hotel
 *         type: string
 *         required: true
 *       - in: formData
 *         name: desk
 *         type: string
 *         required: true
 *       - in: formData
 *         name: lokasi
 *         type: string
 *         required: true
 *       - in: formData
 *         name: user_id
 *         type: integer
 *         required: true
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *       401:
 *        description: Unauthorized access
 *       403:
 *        description: Forbidden access
 */

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, role: string };
  if (!decoded || !decoded.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!process.env.JWT_ACCSESS_TOKEN) {
    throw new Error('JWT_ACCSESS_TOKEN is not defined in environment variables');
  }

  if (Number(decoded.role) !== 2 && Number(decoded.role) !== 1) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const uploadFolder = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  const formData = await req.formData();
  
  try {
    const nama_hotel = formData.get('nama_hotel') as string;
    const desk = formData.get('desk') as string;
    const lokasi = formData.get('lokasi') as string;
    const user_id = formData.get('user_id') as string;
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0 || !nama_hotel || !desk || !lokasi || !user_id) {
      return NextResponse.json({ error: 'Missing required fields or no files uploaded' }, { status: 400 });
    }

    const hotel = await prisma.hotel.create({
      data: {
        nama_hotel,
        desk,
        lokasi,
        user_id: parseInt(user_id),
        images: [],
      },
    });

    const imagePaths: string[] = [];
    for (const file of files) {
      const newFileName = `${file.name.split('.')[0]}&${hotel.id}.${file.name.split('.').pop()}`;
      const filePath = path.join(uploadFolder, newFileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fs.writeFileSync(filePath, buffer);

      imagePaths.push(`uploads/${newFileName}`);
    }

    await prisma.hotel.update({
      where: { id: hotel.id },
      data: { images: imagePaths },
    });

    return NextResponse.json({
      message: 'Hotel created successfully with images',
      hotel: { ...hotel, images: imagePaths },
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}
