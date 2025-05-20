import { NextRequest, NextResponse } from "next/server";
import { StatusKamar } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/utils/prisma";
import generateRandomFileName from "@/utils/generateRandomFileName";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "5mb",
  },
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idKamar = params.id; // Langsung akses tanpa await
  const parseUserKamarId = Number(idKamar);

  if (isNaN(parseUserKamarId)) {
    return NextResponse.json(
      { error: "Invalid kamar ID", success: false },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    
    // Ekstrak dan validasi data
    const nama_kamar = formData.get("nama_kamar")?.toString().trim();
    const desk = formData.get("desk")?.toString().trim();
    const hotel_id = Number(formData.get("hotel_id"));
    const kategori_id = Number(formData.get("kategori_id"));
    const price = Number(formData.get("price"));
    const is_kyc = formData.get("is_kyc") === "true";
    const status = formData.get("status")?.toString().trim() as StatusKamar;
    const files = formData.getAll("files") as File[];
    const features = JSON.parse(formData.get("features")?.toString() || "[]");
    const existingImages = JSON.parse(formData.get("existing_images")?.toString() || "[]");

    // Validasi status
    if (!status || !Object.values(StatusKamar).includes(status)) {
      return NextResponse.json(
        {
          error: "Status tidak valid",
          allowedValues: Object.values(StatusKamar),
          success: false
        },
        { status: 400 }
      );
    }

    // Proses upload file
    const uploadDir = path.join(process.cwd(), "public/uploads/kamars");
    await fs.mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name);
      const newFileName = generateRandomFileName(6, file.name, "Kamar") + ext;
      const filePath = path.join(uploadDir, newFileName);

      await fs.writeFile(filePath, buffer);
      imagePaths.push(newFileName);
    }

    // Update data kamar
    const updatedKamar = await prisma.kamarInHotel.update({
      where: { id: parseUserKamarId },
      data: {
        nama_kamar,
        desk,
        hotel_id,
        kategori_id,
        price: price,
        is_kyc,
        status,
        images: [...existingImages, ...imagePaths],
        features : features,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Kamar updated successfully", kamar: updatedKamar, success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating kamar:", error);
    return NextResponse.json(
      { error: "Failed to update kamar", success: false },
      { status: 500 }
    );
  }
}
