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
 * tags:
 *   - name: Hotels
 *     description: Hotels management endpoints
 * 
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nama_hotel:
 *           type: string
 *         desk:
 *           type: string
 *         lokasi:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         user_id:
 *           type: integer
 * 
 * /hotels/myhotels/update/{id_hotel}:
 *   put:
 *     tags: [Hotels]
 *     summary: Update hotel data - Access Role [Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id_hotel
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the hotel to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_hotel:
 *                 type: string
 *               desk:
 *                 type: string
 *               lokasi:
 *                 type: string
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 hotel:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal server error
 */

export async function PUT(req: NextRequest, { params }: { params: { id_hotel: string } }) {
  const { id_hotel } = await params;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
  }

  if (!id_hotel || isNaN(Number(id_hotel))) {
    return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCSESS_TOKEN as string) as { id: number; role: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userId = Number(decoded.id);
  const isAdmin = Number(decoded.role) === 1;

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Cek apakah hotel milik user
  const existingHotel = await prisma.hotel.findUnique({
    where: { id: Number(id_hotel) },
  });

  if (!existingHotel || existingHotel.user_id !== userId) {
    return NextResponse.json({ error: 'Hotel not found or access denied' }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const nama_hotel = formData.get('nama_hotel') as string;
    const desk = formData.get('desk') as string;
    const lokasi = formData.get('lokasi') as string;
    const files = formData.getAll('file') as File[];

    if (!nama_hotel || !desk || !lokasi || !files.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploadFolder = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const uploadsFile: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }

      const fileName = Date.now() + '-' + file.name;
      const filePath = path.join(uploadFolder, fileName);

      const bytes = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(bytes));
      uploadsFile.push(`uploads/${fileName}`);
    }

    const updatedHotel = await prisma.hotel.update({
      where: { id: Number(id_hotel) },
      data: {
        nama_hotel,
        desk,
        lokasi,
        images: uploadsFile,
        user_id: userId,
      },
    });

    return NextResponse.json({
      message: 'Hotel updated successfully',
      hotel: updatedHotel,
    }, { status: 201 });

  } catch (error) {
    console.error('Error during hotel update:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}
