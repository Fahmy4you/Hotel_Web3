import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, 
    sizeLimit: '10mb'
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama_hotel = formData.get('nama_hotel')?.toString().trim();
    const lokasi = formData.get('lokasi')?.toString().trim();
    const user_id = formData.get('user_id')?.toString().trim();
    const files = formData.getAll('files') as File[];

    const missingFields = [];
    if (!nama_hotel) missingFields.push('nama_hotel');
    if (!lokasi) missingFields.push('lokasi');
    if (!user_id) missingFields.push('user_id');
    if (!files || files.length === 0) missingFields.push('files');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json(
        { error: 'Missing fields', missingFields },
        { status: 400 }
      );
    }
    
    console.log("Form data received:", { nama_hotel, lokasi, user_id, fileCount: files.length });

    if (!nama_hotel || !lokasi || !user_id || !files || files.length === 0) {
      return NextResponse.json({ error: 'Field is missing' }, { status: 400 });
    }

    const hotel = await prisma.hotel.create({
      data: {
        nama_hotel,
        lokasi,
        user_id: parseInt(user_id),
        is_banned: false,
        images: [],
      },
    });

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop();
      const newFileName = `${file.name.split('.')[0]}-${hotel.id}.${ext}`;
      const filePath = path.join(uploadDir, newFileName);

      fs.writeFileSync(filePath, buffer);
      imagePaths.push(`uploads/${newFileName}`);
    }

    // Update hotel dengan path gambar
    await prisma.hotel.update({
      where: { id: hotel.id },
      data: {
        images: imagePaths,
      },
    });

    return NextResponse.json({ message: 'Hotel created successfully', hotel: { ...hotel, images: imagePaths } });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
