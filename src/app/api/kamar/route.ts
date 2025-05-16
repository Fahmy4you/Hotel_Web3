import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import generateRandomFileName from "@/utils/generateRandomFileName";
import { StatusKamar } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "5mb",
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama_kamar = formData.get("nama_kamar")?.toString().trim();
    const desk = formData.get("desk")?.toString().trim();
    const hotel_id = Number(formData.get("hotel_id"));
    const kategori_id = Number(formData.get("kategori_id"));
    const price = Number(formData.get("price"));
    const is_kyc = formData.get("is_kyc") === "true";
    const fasilitas = formData.getAll("fasilitas").map((f) => f.toString());
    const statusInput = formData.get("status")?.toString().trim();
    const status = Object.values(StatusKamar).includes(
      statusInput as StatusKamar
    )
      ? (statusInput as StatusKamar)
      : null;

    if (!status) {
      return NextResponse.json(
        {
          error: "Status tidak valid",
          allowedValues: Object.values(StatusKamar),
        },
        { status: 400 }
      );
    }
    const files = formData.getAll("files") as File[];

    const missingFields = [];
    if (!nama_kamar) missingFields.push("nama_kamar");
    if (!desk) missingFields.push("desk");
    if (!hotel_id) missingFields.push("hotel_id");
    if (!is_kyc) missingFields.push("is_kyc");
    if (!price) missingFields.push("price");
    if (!kategori_id) missingFields.push("kategori_id");
    if (!status) missingFields.push("status");
    if (!files || files.length === 0) missingFields.push("files");
    if (!fasilitas || fasilitas.length === 0) missingFields.push("fasilitas");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return NextResponse.json(
        { error: "Missing fields", missingFields },
        { status: 400 }
      );
    }

    console.log("Form data received:", {
      nama_kamar,
      desk,
      hotel_id,
      kategori_id,
      is_kyc,
      fasilitas,
      fileCount: files.length,
    });

    if (
      !nama_kamar ||
      !kategori_id ||
      !desk ||
      !hotel_id ||
      !files ||
      files.length === 0 ||
      !fasilitas ||
      fasilitas.length === 0 ||
      !status ||
      !is_kyc
    ) {
      return NextResponse.json({ error: "Field is missing" }, { status: 400 });
    }

    const getHotel = await prisma.hotel.findFirst({
      // Ambil Hotel dulu buat cek apakah di hotel ini sudah ada kamar dengan nama tersebut atau belum
      where: {
        id: hotel_id,
      },
    });

    const hotels_ids = Number(getHotel?.id);
    const getNameExistingKamar = await prisma.kamarInHotel.findMany({
      // Ambil Kamar dulu buat cek apakah di hotel ini sudah ada kamar dengan nama tersebut atau belum
      where: {
        hotel_id: hotels_ids,
      },
      select: {
        nama_kamar: true,
      },
    });

    if (getNameExistingKamar.some((kamar) => kamar.nama_kamar === nama_kamar)) {
      return NextResponse.json(
        {
          error: "Error!",
          message: "Kamar dengan nama tersebut sudah terdaftar di Hotel Ini",
        },
        { status: 409 }
      );
    }

    const kamarsInHotel = await prisma.kamarInHotel.create({
      data: {
        nama_kamar: nama_kamar,
        desk: desk,
        price: price,
        kategori_id: kategori_id,
        is_kyc: is_kyc, // Boolean
        status: status, // ini tipenya harusnya enum
        features: fasilitas,
        hotel_id: hotel_id,
        is_active: true,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const uploadDir = path.join(process.cwd(), "public/uploads/kamars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      const newFileName =
        generateRandomFileName(6, file.name, "Kamar") + `.${ext}`;
      const filePath = path.join(uploadDir, newFileName);

      fs.writeFileSync(filePath, buffer);
      imagePaths.push(`uploads/${newFileName}`);
    }

    // Update kamar hotel dengan path gambar
    await prisma.kamarInHotel.update({
      where: { id: kamarsInHotel.id },
      data: {
        images: imagePaths,
      },
    });

    return NextResponse.json({
      message: "Hotel created successfully",
      hotel: { ...kamarsInHotel, images: imagePaths },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
