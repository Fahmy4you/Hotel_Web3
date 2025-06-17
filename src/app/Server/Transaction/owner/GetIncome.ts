"use server";
import { formatDate } from "@/utils/Helper";
import { prisma } from "@/utils/prisma";

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);
  const days = [];
  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getIncome = async (userId: number) => {
  try {
    // const now = new Date();
    // const currentYear = now.getFullYear();
    // const currentMonth = now.getMonth() + 1;
    const getBulanMei = 5;
    const tahunMei = 2025;
    const allDaysInMonth = getDaysInMonth(tahunMei, getBulanMei).map(date =>
      formatDate(date)
    );

    const getMyHotelId = await prisma.hotel.findMany({
      where: { user_id: userId },
      select: { id: true },
    });

    const myHotelsIds = getMyHotelId.map((hotel) => hotel.id);

    if (myHotelsIds.length === 0) {
      return { data: allDaysInMonth.map(date => ({ name: date, revenue: 0 })) };
    }

    const res = await prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        hotel_id: { in: myHotelsIds },
        createdAt: {
          gte: new Date(tahunMei, getBulanMei - 1, 1),
          lt: new Date(tahunMei, getBulanMei, 1),
        },
      },
      _sum: { price_total: true },
    });

    const revenueMap = new Map(
      res.map((item) => [formatDate(item.createdAt), item._sum.price_total || 0])
    );

     const parsedResponse = res.map((item) => ({
      name: formatDate(item.createdAt),
      revenue: Number(item._sum.price_total) || 0,
    }))

    console.log('Final Data from API:', parsedResponse);
    return { data: parsedResponse };
  } catch (error: any) {
    console.error("Error in getIncome:", error.message);
    return { data: [], error: error.message };
  } finally {
    await prisma.$disconnect();
  }
};