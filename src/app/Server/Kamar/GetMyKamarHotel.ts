"use server";
import { prisma } from "@/utils/prisma";

interface GetMyHotelKamarParams {
  search?: string;
  page?: number;
  userId?: number;
}

export async function getMyHotelKamars({
  search = "",
  page = 1,
  userId,
}: GetMyHotelKamarParams) {
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  try {
    const userHotels = await prisma.hotel.findMany({
      where: {
        user_id: userId,
      },
    });

    const hotelIds = userHotels.map((hotel) => hotel.id);

    const kamars = await prisma.kamarInHotel.findMany({
      where: {
        hotel_id: {
          in: hotelIds,
        },
        is_active: true,
        OR: [
          {
            nama_kamar: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        kategori: {
          select: {
            kategori: true,
          },
        },
        hotel: {
          select: {
            nama_hotel: true,
          },
        },
      },
      skip,
      take: pageSize,
    });

    const totalKamars = await prisma.kamarInHotel.count({
      where: {
        hotel_id: {
          in: hotelIds,
        },
        is_active: true,
        OR: [
          {
            nama_kamar: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const formatedResponse = kamars.map((kamar) => ({
      ...kamar,
      nama_hotel: kamar.hotel ? kamar.hotel.nama_hotel : null,
      kategori: kamar.kategori ? kamar.kategori.kategori : null,
      total_kamar : totalKamars
    }));

    console.log("total Kamar", totalKamars);

    return {
      formatedResponse,
      currentPage: page,
      totalPages: Math.ceil(totalKamars / pageSize),
      totalKamars
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch kamars");
  }
}

