import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path, { parse } from "path";
import { prisma } from "@/utils/prisma";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "5mb",
  },
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotel_id = await params.id;
    const ParsedhotelId = parseInt(hotel_id);
    if (isNaN(ParsedhotelId)) {
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
    }

    const formData = await req.formData();

    const nama_hotel = formData.get("nama_hotel")?.toString().trim();
    const desk = formData.get("desk")?.toString().trim();
    const lokasi = formData.get("lokasi")?.toString().trim();
    const user_id = formData.get("user_id")?.toString().trim();
    const files = formData.getAll("files") as File[];

    const existingImages = JSON.parse(
      formData.get("existing_images")?.toString() || "[]"
    );

    const missingFields = [];
    if (!nama_hotel) missingFields.push("nama_hotel");
    if (!desk) missingFields.push("desk");
    if (!lokasi) missingFields.push("lokasi");
    if (!user_id) missingFields.push("user_id");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing fields", missingFields },
        { status: 400 }
      );
    }

    // Proses gambar baru
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let parseUserId;
    if (user_id) {
      parseUserId = Number(user_id);
    } else {
      parseUserId = 0;
    }
    const newImagePaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      const newFileName = `${file.name.split(".")[0]}-${ParsedhotelId}.${ext}`;
      const filePath = path.join(uploadDir, newFileName);

      fs.writeFileSync(filePath, buffer);
      newImagePaths.push(`uploads/${newFileName}`);
    }

    // Gabungkan existing + new
    const allImages = [...existingImages, ...newImagePaths];

    const existingHotel = await prisma.hotel.findFirst({
      where: {
        nama_hotel: {
          equals: nama_hotel,
          mode: "insensitive",
        },
        ...(ParsedhotelId && { NOT: { id: ParsedhotelId } }),
      },
      select: { id: true },
    });

    if (existingHotel) {
      return NextResponse.json(
        {
          message: "Hotel dengan nama tersebut sudah terdaftar",
        },
        { status: 409 }
      );
    }

    const updatedHotel = await prisma.hotel.update({
      where: { id: ParsedhotelId },
      data: {
        nama_hotel,
        lokasi,
        user_id: parseUserId,
        images: allImages,
      },
    });

    return NextResponse.json({
      message: "Hotel updated successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
