"use server";
import { prisma } from "@/utils/prisma";

type GetHotelsOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getAllHotel = async ({ page = 1, limit = 10, search = "" }: GetHotelsOptions) => {
  const offset = (page - 1) * limit;

  // Hitung total data hotel sesuai search
  const totalData = await prisma.hotel.count({
    where: {
      OR: search
        ? [
            { nama_hotel: { contains: search, mode: "insensitive" } },
            { lokasi: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
  });

  const totalPage = Math.ceil(totalData / limit);

  // Ambil data hotel dengan relasi rating & kamar
  const hotels = await prisma.hotel.findMany({
    where: {
      OR: search
        ? [
            { nama_hotel: { contains: search, mode: "insensitive" } },
            { lokasi: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      ratings: {
        select: { bintang: true },
      },
      kamars: {
        select: { id: true },
      },
    },
    orderBy: {
      // Prisma nggak bisa order by agregasi langsung, jadi nanti manual di JS
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  });

  // Hitung rating average & total kamar manual di JS
  const mappedHotels = hotels.map((hotel) => {
    const totalKamar = hotel.kamars.length;
    const avgRating =
      hotel.ratings.length > 0
        ? hotel.ratings.reduce((acc, cur) => acc + cur.bintang, 0) / hotel.ratings.length
        : 0;

    return {
      id: hotel.id,
      nama_hotel: hotel.nama_hotel,
      lokasi: hotel.lokasi,
      images: hotel.images,
      createdat: hotel.createdAt,
      rating: Number(avgRating.toFixed(2)),
      total_kamar: totalKamar,
    };
  });

  // Optional: bisa sorting by rating desc di sini
  mappedHotels.sort((a, b) => b.rating - a.rating);

  return {
    hotels: mappedHotels,
    totalPage,
    totalData,
    currentPage: page,
  };
};




export const getHotelTop = async () => {
  const topHotels = await prisma.hotel.findMany({
    select: {
      id: true,
      nama_hotel: true,
      lokasi: true,
      images: true,
      createdAt: true,
      kamars: {
        select: {
          id: true,
        },
      },
      ratings: {
        select: {
          bintang: true,
        },
      },
    },
  });

  // Proses hasilnya
  const result = topHotels.map(hotel => {
    const total_kamar = hotel.kamars.length;
    const rating =
      hotel.ratings.length > 0
        ? hotel.ratings.reduce((acc, cur) => acc + cur.bintang, 0) /
          hotel.ratings.length
        : 0;

    return {
      id: hotel.id,
      nama_hotel: hotel.nama_hotel,
      lokasi: hotel.lokasi,
      images: hotel.images,
      createdAt: hotel.createdAt,
      rating,
      total_kamar,
    };
  });

  // Urutkan berdasarkan rating tertinggi, ambil top 12
  result.sort((a, b) => b.rating - a.rating);

  return result.slice(0, 12);
};


export const getHotelById = async (hotel_id: number) => {
  const data = await prisma.hotel.findFirst({
    where: {
      id: hotel_id
    },
    include: {
      _count: {
        select: {kamars: true}
      }
    }
  })

  if(!data) return null;

  const avgRating = await prisma.rating.aggregate({
    where: {
      hotel_id: hotel_id
    },
    _avg: {
      bintang: true
    }
  })

  return {
    ...data,
    ratingAvg: avgRating._avg 
  };
}