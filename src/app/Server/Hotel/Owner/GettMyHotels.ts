"use server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/utils/jwt";
import { prisma } from "@/utils/prisma";

interface GetAllHotelsParams {
  search?: string;
  page?: number;
}

export async function getMyHotels({ search = '', page = 1}: GetAllHotelsParams) {
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  try {
    const cookiesHttp = await cookies();
    const getToken = cookiesHttp.get('refreshToken')?.value;
    if (!getToken) {
      throw new Error("Token not found");
    }
    const userID = await verifyRefreshToken(getToken);
    const hotels = await prisma.hotel.findMany({
      where: {
        user_id: userID.id,
        is_banned: false,
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalHotels = await prisma.hotel.count({
      where: {
        user_id: userID.id,
        is_banned: false,
      },
    });

    return {
      hotels,
      currentPage: page,
      totalPages: Math.ceil(totalHotels / pageSize),
      totalHotels,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch hotel");
  }
}