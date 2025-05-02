import { verifyToken } from "@/utils/verifyToken";
import { checkRole } from "@/utils/checkRole";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { checkIsNumber } from "@/utils/checkIsNumber";

const prisma = new PrismaClient();

/**
 * @swagger
 * /rooms/add/{id_hotel}:
 *   post:
 *     tags: [Rooms]
 *     summary: Add a new room to a hotel - Access Role [Admin, Pemilik Hotel]
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id_hotel
 *         required: true
 *         description: The ID of the hotel where the room will be added
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: nama_kamar
 *         type: string
 *         required: true
 *         description: The name of the room
 *       - in: formData
 *         name: price
 *         type: string
 *         required: true
 *         description: The price of the room
 *       - in: formData
 *         name: kategori_id
 *         type: string
 *         required: true
 *         description: The category ID of the room
 *       - in: formData
 *         name: features
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *         description: Features of the room
 *       - in: formData
 *         name: images
 *         type: file
 *         required: true
 *         description: Room images
 *         collectionFormat: multi
 *     responses:
 *       201:
 *         description: Room added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kamar berhasil ditambahkan"
 *                 kamar:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the room
 *                       example: 1
 *                     nama_kamar:
 *                       type: string
 *                       description: The name of the room
 *                       example: "Deluxe Room"
 *                     price:
 *                       type: integer
 *                       description: The price of the room
 *                       example: 100000
 *                     kategori_id:
 *                       type: integer
 *                       description: The category ID of the room
 *                       example: 2
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Features of the room
 *                       example: ["Wi-Fi", "AC", "Breakfast"]
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Images of the room
 *                       example: ["uploads/rooms/image1.jpg", "uploads/rooms/image2.jpg"]
 *       400:
 *         description: Missing required fields or invalid input
 *       403:
 *         description: Forbidden access (User is not Admin or Pemilik Hotel)
 *       404:
 *         description: Hotel or category not found
 *       500:
 *         description: Internal Server Error
 */


export async function POST(
  request: NextRequest,
  { params }: { params: { id_hotel: string } }
) {
  const { id_hotel } = await params;

  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }

  const tokenUser = verifyToken(token);
  if (tokenUser instanceof NextResponse) return tokenUser;

  // role permition for adding kamar is admin or pemilik hotel
  const isAdminOrPemilik = checkRole(tokenUser, 2) || checkRole(tokenUser, 1);
  if (isAdminOrPemilik) return isAdminOrPemilik;

  try {
    const uploadFolder = path.join(process.cwd(), "public/uploads/rooms");
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    try {
      const form = await request.formData();
      const nama_kamar = form.get("nama_kamar") as string;
      const price = form.get("price") as string;
      const kategori_id = form.get("kategori_id") as string;
      const features = form.getAll("features") as string[];
      const images = form.getAll("images") as File[];

      if (
        !nama_kamar ||
        !price ||
        !kategori_id ||
        !id_hotel ||
        !features ||
        images.length === 0
      ) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      if (!checkIsNumber(id_hotel)) {
        return NextResponse.json(
          { message: "hotel_id must be a number" },
          { status: 400 }
        );
      }

      const hotel = await prisma.hotel.findFirst({
        where: { id: Number(id_hotel) },
      });

      if (!hotel) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
      }

      if (!checkIsNumber(kategori_id)) {
        return NextResponse.json(
          { message: "kategori_id must be a number" },
          { status: 400 }
        );
      }

      const kategori = await prisma.kategoriKamar.findFirst({
        where: { id: Number(kategori_id) },
      });

      if (!kategori) {
        return NextResponse.json(
          { error: "Kategori not found" },
          { status: 404 }
        );
      }

      if (!checkIsNumber(price)) {
        return NextResponse.json(
          { message: "price must be a number" },
          { status: 400 }
        );
      }

      const room = await prisma.kamarInHotel.create({
        data: {
          nama_kamar: nama_kamar,
          price: Number(price),
          kategori_id: Number(kategori_id),
          hotel_id: parseInt(id_hotel),
          features,
          images: [],
        },
      });

      const imagePaths: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop();
        const fileName = `${file.name.split(".")[0]}&${room.id}.${ext}`;
        const filePath = path.join(uploadFolder, fileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);
        imagePaths.push(`uploads/rooms/${fileName}`);
      }

      await prisma.kamarInHotel.update({
        where: { id: room.id },
        data: {
          images: imagePaths,
        },
      });

      return NextResponse.json(
        {
          message: "Kamar berhasil ditambahkan",
          kamar: { ...room, images: imagePaths },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error adding kamar:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error adding kamar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
