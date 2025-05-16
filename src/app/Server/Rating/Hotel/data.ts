'use server'
import { prisma } from "@/utils/prisma";


export const getRatingByHotel = async ({
  page = 1,
  limit = 10,
  hotel_id,
}: { page?: number; limit?: number; hotel_id: number }) => {
  const offset = (page - 1) * limit;

  // Hitung total rating
  const totalData = await prisma.rating.count({
    where: {
      hotel_id,
    },
  });
  const totalPage = Math.ceil(totalData / limit);

  // Ambil data rating-nya
  const ratings = await prisma.rating.findMany({
    where: {
      hotel_id,
    },
    include: {
      hotel: {
        select: {
          nama_hotel: true,
        },
      },
      user: {
        select: {
          nama: true,
          profile_pict: true,
          role: {
            select: {
              role: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  });

  // Map hasilnya sesuai shape yang di-query sebelumnya
  const result = ratings.map((r) => ({
    rating_id: r.id,
    bintang: r.bintang,
    komentar: r.komentar,
    createdAt: r.createdAt,
    nama_hotel: r.hotel.nama_hotel,
    nama: r.user.nama,
    profile: r.user.profile_pict,
    role: r.user.role.role,
  }));

  return {
    ratings: result,
    totalPage,
    totalData,
    currentPage: page,
  };
};

