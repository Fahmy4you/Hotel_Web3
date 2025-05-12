"use server"
import { prisma } from "@/utils/prisma"

export const getKategoriByHotelID = async (hotel_id: string) => {
    try {
        const request = await prisma.kategoriKamar.findMany({
            where: {
                hotel_id: Number(hotel_id)
            },
        })
        return request;
    } catch (error) {
        console.error("Error kategori for hotels:", error);
        throw new Error("Failed to get kategori for hotels");
    }
}