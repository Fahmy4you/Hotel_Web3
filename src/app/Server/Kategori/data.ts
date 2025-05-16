"use server"
import { prisma } from "@/utils/prisma"
import { Prisma } from "@prisma/client";

export const getAllKategori = async ({
  page = 1,
  limit = 12,
  search = '',
}: { page?: number; limit?: number; search?: string }) => {
  const offset = (page - 1) * limit;

  const kategoriWhere: Prisma.KategoriKamarWhereInput = {
    is_banned: false,
    ...(search
      ? {
          OR: [
            {
              kategori: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              hotel: {
                nama_hotel: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }
      : {}),
  };

  // Ambil semua kategori + relasi kamar & hotel (buat filter total_kamar ≠ 0)
  const kategoriList = await prisma.kategoriKamar.findMany({
    where: kategoriWhere,
    include: {
      hotel: {
        select: {
          nama_hotel: true,
          ratings: {
            select: {
              bintang: true,
            },
          },
        },
      },
      kamar: true, // relasi kamar di schema => KategoriKamar hasMany kamar
    },
  });

  // Filter kategori yang punya minimal 1 kamar
  const filteredKategori = kategoriList.filter((k) => k.kamar.length !== 0);

  const totalData = filteredKategori.length;
  const totalPage = Math.ceil(totalData / limit);

  // Map data hasilnya
  const data = filteredKategori
    .map((k) => {
      const totalKamar = k.kamar.length;
      const ratingSum = k.hotel.ratings.reduce((acc, cur) => acc + cur.bintang, 0);
      const ratingAvg =
        k.hotel.ratings.length > 0
          ? Number((ratingSum / k.hotel.ratings.length).toFixed(1))
          : 0;

      return {
        id: k.id,
        kategori: k.kategori,
        image: k.image,
        hotel_id: k.hotel_id,
        nama_hotel: k.hotel.nama_hotel,
        rating: ratingAvg,
        total_kamar: totalKamar,
      };
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(offset, offset + limit);

  return {
    data,
    totalPage,
    totalData,
    currentPage: page,
  };
};



export const getKategoriDataIdIncludeHotel = async (id_kategori: number) => {
  const result = await prisma.kategoriKamar.findFirst({
    select: {
      id: true,
      kategori: true,
      hotel: {
        select: {
          id: true,
          nama_hotel: true,
          lokasi: true,
          images: true,
          ratings: {
            select: {
              bintang: true
            }
          }
        }
      }
    },
    where: { id: id_kategori }
  });

  if (!result) {
    return null; // Atau bisa lempar error tergantung kebutuhan
  }

  // Hitung total kamar di kategori ini
  const totalKamar = await prisma.kamarInHotel.count({
    where: {
      kategori_id: id_kategori
    }
  });

  // Hitung average rating hotel
  const ratings = result.hotel?.ratings?.map(r => r.bintang) || [];
  const averageRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  return {
    id: result.id,
    kategori: result.kategori,
    total_kamar: totalKamar,
    hotel: result.hotel
      ? {
          id: result.hotel.id,
          nama_hotel: result.hotel.nama_hotel,
          lokasi: result.hotel.lokasi,
          images: result.hotel.images,
          rating: averageRating
        }
      : null
  };
};


