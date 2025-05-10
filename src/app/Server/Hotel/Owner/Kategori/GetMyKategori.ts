"use server"
import { prisma } from "@/utils/prisma"

export const getMyKategori = async (userId: string) => {
    try {
        const request = await prisma.kategoriKamar.findMany({
            where: {
                user_id: Number(userId)
            },
            include : {
                _count : {
                    select : {
                        kamar : true
                    }
                }
            }
        })
        return request;
    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw new Error("Failed to fetch hotels");
    }
}