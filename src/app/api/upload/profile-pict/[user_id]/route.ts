import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import generateRandomFileName from '@/utils/generateRandomFileName';

export const config = {
  api: {
    bodyParser: false,
  },
};

type Params = {
  params: {
    user_id: string;
  };
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSizeInMB = 2; // Batas ukuran file 2MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (file.size > maxSizeInBytes) {
    return { valid: false, error: `Ukuran file melebihi ${maxSizeInMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau GIF' };
  }

  return { valid: true };
};

export async function POST(req: NextRequest, { params }: Params) {
  const userId = parseInt(params.user_id, 10); // Konversi user_id ke number
  const uploadFolder = path.join(process.cwd(), 'public/uploads/profile_pict');

  // Pastikan folder upload ada
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  // Validasi userId
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID pengguna tidak valid' }, { status: 400 });
  }

  try {
    // Ambil data FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validasi file
    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Buat nama file unik
    const newFileName = generateRandomFileName(9, file.name, "pp_") + path.extname(file.name);
    const filePath = path.join(uploadFolder, newFileName);

    // Simpan file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    let profilePicture;
    let message;

    if (user) {
      // Hapus foto profil lama jika ada
      if (user.profile_pict) {
        const oldImagePath = path.join(uploadFolder, user.profile_pict);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Gagal menghapus foto profil lama:', err);
          }
        }
      }

      // Perbarui foto profil
      profilePicture = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profile_pict: newFileName,
        },
      });
      message = 'Berhasil memperbarui foto profil';
    } else {
      // Jika pengguna tidak ditemukan, Return error
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message,
        profilePicture: {
          id: profilePicture.id,
          profile_pict: profilePicture.profile_pict,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gagal memproses unggahan:', error);
    return NextResponse.json({ error: 'Gagal memproses unggahan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}