'use server'
import { prisma } from "@/utils/prisma";
import fs from "fs";
import path from "path";

export async function deleteMyKamarHotels(idKamar: number) {
  try {
    if (!idKamar || isNaN(idKamar)) {
      throw new Error("Invalid kamar ID");
    }

    const kamar = await prisma.kamarInHotel.findUnique({
      where: { id: idKamar },
      select: { images: true }
    });

    if (!kamar) {
      throw new Error(`Kamar with ID ${idKamar} not found`);
    }

    await prisma.kamarInHotel.delete({
      where: { id: idKamar }
    });

    if (kamar.images?.length) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "kamars");
      
      const deletionResults = await Promise.allSettled(
        kamar.images.map(async (imageName) => {
          const fileName = imageName.split("/").pop() || "";
          const imagePath = path.join(uploadsDir, fileName);
          
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              return { success: true, path: imagePath };
            }
            return { success: false, path: imagePath, error: "File not found" };
          } catch (err) {
            return { success: false, path: imagePath, error: err instanceof Error ? err.message : String(err) };
          }
        })
      );

      deletionResults.forEach(result => {
        if (result.status === 'fulfilled') {
          const { success, path, error } = result.value;
          if (success) {
            console.log(`Successfully deleted image: ${path}`);
          } else {
            console.warn(`Failed to delete image ${path}: ${error}`);
          }
        }
      });
    }

    return { success: true, message: "Kamar deleted successfully" };
  } catch (error) {
    console.error("Error in deleteMyKamarHotels:", error);
    
    let errorMessage = "Failed to delete kamar";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }

    return { success: false, message: errorMessage };
  }
}