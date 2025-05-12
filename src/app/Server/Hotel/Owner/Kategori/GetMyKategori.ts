"use server"
import { prisma } from "@/utils/prisma"

export const getMyKategori = async (userId: string) => {
    try {

        const getHotelByUserId = await prisma.hotel.findMany({
            where: {
                user_id: Number(userId)
            }
        })

        const hotelIDs = getHotelByUserId.map(hotel => hotel.id);

        const request = await prisma.kategoriKamar.findMany({
            where: {
                hotel_id: {
                    in : hotelIDs
                }
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