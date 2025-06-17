"use server";
import { prisma } from "@/utils/prisma";
import { formatDate } from "@/utils/Helper";

interface props {
  search?: string;
  page?: number;
}

export async function getMyHotelsTransaction(userId: number) {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        user_id: userId,
        is_banned: false,
      },
      select: {
        id: true,
        nama_hotel: true,
      },
    });

    if (!hotels.length) {
      return {
        success: true,
        message: "No hotels found",
        data: {
          hotels: [],
          bookings: [],
        },
      };
    }

    const hotelIds = hotels.map((hotel) => hotel.id);
    const now = new Date();
    const todayUTC = new Date(Date.UTC(
      now.getUTCFullYear(), 
      now.getUTCMonth(), 
      now.getUTCDate(), 
      0, 0, 0, 0
    ));
    const tomorrowUTC = new Date(Date.UTC(
      now.getUTCFullYear(), 
      now.getUTCMonth(), 
      now.getUTCDate() + 1, 
      0, 0, 0, 0
    ));
    
    const bookings = await prisma.booking.findMany({
      where: {
        hotel_id: {
          in: hotelIds,
        },
        createdAt: {
          gte: todayUTC,
          lt: tomorrowUTC
        }
      },
      include: {
        kamar: {
          include: {
            kategori: {
              select: {
                kategori: true,
              },
            },
          },
        },
        user: {
          select: {
            nama: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      hotel:
        hotels.find((h) => h.id === booking.hotel_id)?.nama_hotel ||
        "Unknown Hotel",
      kamar: booking.kamar.nama_kamar,
      tipe_kamar: booking.kamar.kategori.kategori,
      pemesan: booking.user_booking,
      check_in: formatDate(booking.tanggal_checkin),
      check_out: formatDate(booking.tanggal_checkout),
      tanggal_pesan: formatDate(booking.createdAt),
    }));

    return { success: true, data: formattedBookings };
  } catch (error) {
    console.error("Error in getMyHotelsTransaction:", error);
    return { success: false, message: "Error in getMyHotelsTransaction" };
  } finally {
    prisma.$disconnect();
  }
}