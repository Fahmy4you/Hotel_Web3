import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
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
 * /upload/hotels:
 *   post:
 *     tags: [Hotels]
 *     summary: Create a new Hotel data
 *     description: Create a new Hotel with image upload and related information.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_hotel:
 *                 type: string
 *                 description: Name of the hotel.
 *               desk:
 *                 type: string
 *                 description: Description of the hotel.
 *               lokasi:
 *                 type: string
 *                 description: Location of the hotel.
 *               user_id:
 *                 type: integer
 *                 description: ID of the user associated with the hotel.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the hotel.
 *             required:
 *               - nama_hotel
 *               - desk
 *               - lokasi
 *               - user_id
 *               - file
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Hotel created successfully'
 *                 hotel:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama_hotel:
 *                       type: string
 *                       example: 'Luxury Resort'
 *                     desk:
 *                       type: string
 *                       example: 'A luxurious beach resort.'
 *                     lokasi:
 *                       type: string
 *                       example: 'Bali, Indonesia'
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['uploads/1628232768-image.jpg']
 *       400:
 *         description: Invalid input or no file uploaded
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
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
    const file = formData.get('file') as File;

    if (!file || !nama_hotel || !desk || !lokasi || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFileName = Date.now() + '-' + file.name;
    const filePath = path.join(uploadFolder, newFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const hotel = await prisma.hotel.create({
      data: {
        nama_hotel: nama_hotel,
        desk: desk,
        lokasi: lokasi,
        user_id: parseInt(user_id),
        images: [`uploads/${newFileName}`],
      },
    });

    return NextResponse.json({
      message: 'Hotel created successfully',
      hotel,
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}