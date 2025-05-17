"use server"
import { prisma } from "@/utils/prisma"

export const getMyKategori = async (userId: string, page: number = 1, itemsPerPage: number = 10) => {
    try {
        const skip = (page - 1) * itemsPerPage;

        // Ambil hotel yang dimiliki pengguna
        const getHotelByUserId = await prisma.hotel.findMany({
            where: {
                user_id: Number(userId)
            }
        });

        const hotelIDs = getHotelByUserId.map(hotel => hotel.id);

        // Ambil data kategori dengan pagination
        const [request, totalCount] = await Promise.all([
            prisma.kategoriKamar.findMany({
                where: {
                    hotel_id: {
                        in: hotelIDs
                    }
                },
                include: {
                    _count: {
                        select: {
                            kamar: true
                        }
                    },
                    hotel: {
                        select: {
                            nama_hotel: true
                        }
                    }
                },
                skip,
                take: itemsPerPage,
                orderBy: {
                    id: 'asc'
                }
            }),
            prisma.kategoriKamar.count({
                where: {
                    hotel_id: {
                        in: hotelIDs
                    }
                }
            })
        ]);

        // Parse data
        const parseRequest = request.map(kategori => ({
            ...kategori,
            nama_hotel: kategori.hotel?.nama_hotel,
            kamar_count: kategori._count.kamar
        }));

        return {
            data: parseRequest,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / itemsPerPage)
        };
    } catch (error) {
        console.error("Error fetching kategori:", error);
        throw new Error("Failed to fetch kategori");
    }
}