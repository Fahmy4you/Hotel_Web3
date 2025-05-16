'use server'
import { prisma } from "@/utils/prisma"


export const updateMyKategori = async (kategoriId: number, kategori: string) => {
    try {
        const request = await prisma.kategoriKamar.update({
            where: {
                id: kategoriId
            },
            data: {
                kategori: kategori
            }
        })

        if (request) {
            return {
                success: true,
                message: "Successfully updated category",
                data: request
            }
        }
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
    } finally {
        prisma.$disconnect();
    }
}