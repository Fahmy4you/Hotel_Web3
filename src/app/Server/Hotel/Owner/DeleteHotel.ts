"use server";
import { prisma } from "@/utils/prisma";
import fs from "fs";
import path from "path";

export async function deleteHotel(id: number) {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            select: { images: true },
        });

        // Hapus hotel dari database
        const deletedHotel = await prisma.hotel.delete({
            where: { id },
        });

        // Hapus gambar dari filesystem
        if (hotel?.images && hotel.images.length > 0) {
            hotel.images.forEach((imgPath) => {
                const fullPath = path.join(process.cwd(), "public", imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        return deletedHotel;
    } catch (error) {
        console.error("Error deleting hotel and images:", error);
        throw new Error("Failed to delete hotel");
    }
}
