import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json();

    // Validasi input
    if (!imagePath) {
      return NextResponse.json(
        { success: false, message: 'Image path is required' },
        { status: 400 }
      );
    }

    // Keamanan: Hanya izinkan path tertentu
    const allowedPaths = ['/uploads/kamars/'];
    if (!allowedPaths.some(allowedPath => imagePath.startsWith(allowedPath))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized path' },
        { status: 403 }
      );
    }

    // Construct full path
    const fullPath = path.join(process.cwd(), 'public', imagePath);

    // Periksa jika file ada
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    // Hapus file
    await fs.unlink(fullPath);

    return NextResponse.json(
      { success: true, message: 'Image deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

//Agar tidak ada file chacing di development
export const dynamic = 'force-dynamic';