"use server"
import { prisma } from "@/utils/prisma"

export const deleteMyKategori = async (kategoriId: number) => {
    try {
        const request = await prisma.kategoriKamar.delete({
            where: {
                id: kategoriId
            }
        })

        if (request) {
            return {
                success: true,
                message: "Successfully deleted category",
                data: request
            }
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
    } finally {
        prisma.$disconnect();
    }
}