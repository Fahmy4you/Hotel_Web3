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
                },
                hotel : {
                    select : {
                        nama_hotel : true
                    }
                }
            }
        })
        const parseRequest = request.map(kategori => ({
            ...kategori,
            nama_hotel : kategori.hotel?.nama_hotel,
            kamar_count : kategori._count.kamar
        }))
        //console.log(parseRequest);
        return parseRequest;
    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw new Error("Failed to fetch hotels");
    }
}