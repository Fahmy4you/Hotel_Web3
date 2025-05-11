'use server'
import { prisma } from "@/utils/prisma"

export const addKategori = async (kategori : string, userId : string) => {
    try {
        const request = await prisma.kategoriKamar.create({
            data: {
                hotel_id : Number(userId),
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