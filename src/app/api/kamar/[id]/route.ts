import { NextRequest, NextResponse } from "next/server";
import { StatusKamar } from "@prisma/client";
import path from "path";
import fs from "fs";
import { prisma } from "@/utils/prisma";
import generateRandomFileName from "@/utils/generateRandomFileName";

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
  const idKamar = params.id;

  try {
    const parseUserKamarId = Number(idKamar);
    if (isNaN(parseUserKamarId)) {
      return NextResponse.json({ error: "Invalid kamar ID" }, { status: 400 });
    }

    const formData = await req.formData();

    // Input parsing and validation
    const nama_kamar = formData.get("nama_kamar")?.toString().trim();
    const desk = formData.get("desk")?.toString().trim();
    const hotel_id = Number(formData.get("hotel_id"));
    const kategori_id = Number(formData.get("kategori_id"));
    const price = Number(formData.get("price"));
    const is_kyc = formData.get("is_kyc") === "true";
    const statusInput = formData.get("status")?.toString().trim();
    const files = formData.getAll("files") as File[];
    const existingImages = JSON.parse(
      formData.get("existing_images")?.toString() || "[]"
    );

    // Handle facilities - get both new and existing ones
    const newFasilitas = formData.getAll("fasilitas").map((f) => f.toString());
    const existingFasilitas = JSON.parse(
      formData.get("existing_fasilitas")?.toString() || "[]"
    );

    // Combine existing and new facilities, remove duplicates
    const combinedFasilitas = [
      ...new Set([...existingFasilitas, ...newFasilitas]),
    ];

    // Validate status
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

    // Validate required fields
    const missingFields = [];
    if (!nama_kamar) missingFields.push("nama_kamar");
    if (!desk) missingFields.push("desk");
    if (!hotel_id) missingFields.push("hotel_id");
    if (is_kyc === undefined) missingFields.push("is_kyc");
    if (!price) missingFields.push("price");
    if (!kategori_id) missingFields.push("kategori_id");
    if (!status) missingFields.push("status");
    if (!files || files.length === 0) missingFields.push("files");
    if (combinedFasilitas.length === 0) missingFields.push("fasilitas");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing fields", missingFields },
        { status: 400 }
      );
    }

    // Check if kamar name already exists in the same hotel (excluding current kamar)
    const kamarExists = await prisma.kamarInHotel.findFirst({
      where: {
        hotel_id: hotel_id,
        nama_kamar: nama_kamar,
        NOT: {
          id: parseUserKamarId,
        },
      },
    });

    if (kamarExists) {
      return NextResponse.json(
        {
          error: "Error!",
          message: "Kamar dengan nama tersebut sudah terdaftar di Hotel Ini",
        },
        { status: 409 }
      );
    }

    // Process file uploads
    const uploadDir = path.join(process.cwd(), "public/uploads/kamars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name);
      const newFileName = generateRandomFileName(6, file.name, "Kamar") + ext;
      const filePath = path.join(uploadDir, newFileName);

      fs.writeFileSync(filePath, buffer);
      imagePaths.push(`/uploads/kamars/${newFileName}`);
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...imagePaths];

    // Update kamar with transaction
    const updateKamar = await prisma.$transaction(async (tx) => {
      return await tx.kamarInHotel.update({
        where: {
          id: parseUserKamarId,
        },
        data: {
          nama_kamar: nama_kamar,
          desk: desk,
          hotel_id: hotel_id,
          kategori_id: kategori_id,
          price: price,
          is_kyc: is_kyc,
          features: combinedFasilitas, // Use the combined facilities
          status: status,
          images: allImages,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json(
      { message: "Kamar updated successfully", kamar: updateKamar },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating kamar:", error);
    return NextResponse.json(
      { error: "Failed to update kamar" },
      { status: 500 }
    );
  }
}
