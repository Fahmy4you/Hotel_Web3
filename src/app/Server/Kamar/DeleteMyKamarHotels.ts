'use server'
import { prisma } from "@/utils/prisma";
import fs from "fs";
import path from "path";

export async function deleteMyKamarHotels(idKamar: number) {
  try {
    const findKamar = await prisma.kamarInHotel.findFirst({
      where: {
        id: idKamar,
      },
      select: {
        images: true,
      },
    });

    const deleteMyKamr = await prisma.kamarInHotel.delete({
      where: {
        id: idKamar,
      },
    });

    if (findKamar?.images && findKamar.images.length > 0) {
      findKamar.images.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), "public", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
  } catch (error) {
    console.error("Error deleting kamar hotels:", error);
    throw new Error("Failed to delete kamar hotels");
  }
}
