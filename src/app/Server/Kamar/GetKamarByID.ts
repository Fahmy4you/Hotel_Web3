"use server";
import { parseField } from "@/utils/arrayJsonFormater";
import { prisma } from "@/utils/prisma";

export async function getKamarById(idKamar: number) {
  try {
    const res = await prisma.kamarInHotel.findFirst({
      where: {
        id: idKamar,
        is_active: true,
      },
      include: {
        hotel: true,
        kategori: true,
      },
    });

    if (!res) {
      return null;
    }

    
    const responseParsed = {
      id: res.id,
      nama_kamar: res.nama_kamar,
      harga_kamar: res.price,
      kategori_id: res.kategori_id,
      kategori: res.kategori.kategori,
      hotel_id: res.hotel_id,
      hotel: res.hotel.nama_hotel,
      deskripsi: res.desk,
      images: parseField(res.images),
      is_active: res.is_active,
      status: res.status,
      features: parseField(res.features),
    };
    console.log(responseParsed);
    return responseParsed;
  } catch (error) {
    console.error("Error get detail kamar:", error);
  }
}
