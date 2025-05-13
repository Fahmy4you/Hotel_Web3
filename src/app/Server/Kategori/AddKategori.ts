'use server'
import { prisma } from "@/utils/prisma"

export const addKategori = async (kategori : string, hotel_id : string) => {
    try {
        const request = await prisma.kategoriKamar.create({
            data: {
                hotel_id : Number(hotel_id),
                kategori : kategori,
                is_banned : false, // default status
            }
        })

        if (request) {
            return {
                success: true,
                message: "Successfully added category",
                data: request
            }
        }
    } catch (error) {
        console.error("Error adding category:", error);
        throw new Error("Failed to add category");
    } finally {

    }
}