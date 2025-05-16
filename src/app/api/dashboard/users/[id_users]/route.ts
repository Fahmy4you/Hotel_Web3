import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate and parse the ID parameter
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check user role
    const checkRole = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role_id: true
      }
    });

    if (!checkRole) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (checkRole.role_id === 1) {
      return NextResponse.json(
        { message: "Forbidden Access, this endpoint only available for admin and owner hotels" },
        { status: 403 }
      );
    }

    // Get hotels owned by user
    const getMyHotels = await prisma.hotel.findMany({
      where: {
        user_id: userId
      },
      select: {
        id: true
      }
    });

    const idHotels = getMyHotels.map((hotel) => hotel.id);

    // Get rooms in these hotels
    const getMyKamar = await prisma.kamarInHotel.findMany({
      where: {
        hotel_id: {
          in: idHotels
        }
      },
      select: {
        id: true
      }
    });

    const idKamars = getMyKamar.map((kamar) => kamar.id);

    // Get today's bookings count
    const todayBooking = await prisma.booking.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        kamar_id: {
          in: idKamars
        },
        hotel_id: {
          in: idHotels
        }
      }
    });

    // Get today's visitors count
    const todayVisitor = await prisma.booking.count({
      where: {
        tanggal_checkin: {
          gte: today,
          lt: tomorrow
        },
        kamar_id: {
          in: idKamars
        },
        hotel_id: {
          in: idHotels
        }
      }
    });

    // Get today's income
    const todaysIncome = await prisma.booking.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        kamar_id: {
          in: idKamars
        },
        hotel_id: {
          in: idHotels
        }
      },
      _sum: {
        price_total: true
      }
    });

    const response = {
      todayBooking,
      todayVisitor,
      todaysIncome: todaysIncome._sum.price_total || 0
    };

    return NextResponse.json(
      { message: "Success!", data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}