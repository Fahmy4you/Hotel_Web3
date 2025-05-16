"use server";
import { prisma } from "@/utils/prisma";

type KamarTypeAllByHotel = {
  page?: number;
  limit?: number;
  search?: string;
  hotel_id: number;
};
type KamarTypeAllByKategori = {
  page?: number;
  limit?: number;
  search?: string;
  kategori_id: number
};


export const getAllKamarByHotel = async ({ page = 1, limit = 10, search = "", hotel_id }: KamarTypeAllByHotel) => {
  const offset = (page - 1) * limit;

  // Hitung total data kamar sesuai hotel dan search
  const totalData = await prisma.kamarInHotel.count({
    where: {
      hotel_id,
      AND: search
        ? {
            OR: [
              { nama_kamar: { contains: search, mode: "insensitive" } },
              { kategori: { kategori: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
    },
  });

  const totalPage = Math.ceil(totalData / limit);

  // Ambil data kamar-nya
  const data = await prisma.kamarInHotel.findMany({
    where: {
      hotel_id,
      AND: search
        ? {
            OR: [
              { nama_kamar: { contains: search, mode: "insensitive" } },
              { kategori: { kategori: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
    },
    include: {
      kategori: {
        select: {
          kategori: true,
        },
      },
    },
    orderBy: {
      nama_kamar: "desc",
    },
    skip: offset,
    take: limit,
  });

  // Map hasilnya biar sesuai shape hasil sebelumnya
  const result = data.map((item) => ({
    id: item.id,
    nama_kamar: item.nama_kamar,
    images: item.images,
    price: item.price,
    createdat: item.createdAt,
    features: item.features,
    is_kyc: item.is_kyc,
    kategori_id: item.kategori_id,
    kategori: item.kategori.kategori,
  }));

  return {
    data: result,
    totalPage,
    totalData,
    currentPage: page,
  };
};



export const getAllKamarByKategori = async ({ page = 1, limit = 10, search = "", kategori_id }: KamarTypeAllByKategori) => {
  const offset = (page - 1) * limit;

  // Prisma where condition
  const whereCondition: any = {
    kategori_id,
    ...(search && {
      OR: [
        { nama_kamar: { contains: search, mode: "insensitive" } },
        { hotel: { nama_hotel: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  // Total count
  const totalData = await prisma.kamarInHotel.count({
    where: whereCondition,
  });

  const totalPage = Math.ceil(totalData / limit);

  // Fetch data
  const data = await prisma.kamarInHotel.findMany({
    where: whereCondition,
    select: {
      id: true,
      nama_kamar: true,
      images: true,
      price: true,
      createdAt: true,
      features: true,
      is_kyc: true,
      hotel_id: true,
      hotel: {
        select: {
          nama_hotel: true,
        },
      },
    },
    orderBy: {
      nama_kamar: 'desc',
    },
    skip: offset,
    take: limit,
  });

  // Map hasil biar flat hotel_id + nama_hotel (karena relasi nested)
  const result = data.map(item => ({
    ...item,
    nama_hotel: item.hotel?.nama_hotel,
  }));

  return {
    data: result,
    totalPage,
    totalData,
    currentPage: page,
  };
};


export const getKamarById = async (id: number) => {
  const data = await prisma.kamarInHotel.findFirst({
    where: {
      id: id
    },
    select: {
      id: true,
      nama_kamar: true,
      desk: true,
      price: true,
      images: true,
      features: true,
      createdAt: true,
      updatedAt: true,
      hotel: {
        select: {
          id: true,
          nama_hotel: true,
          user: {
            select: {
              wallet_address: true
            }
          }
        }
      },
      kategori: {
        select: {
          kategori: true
        }
      }
    }
  })

  return data;
}