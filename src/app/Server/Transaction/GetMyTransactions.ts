"use server"
import { formatDateWithDay } from "@/utils/dateFormater";
import { prisma } from "@/utils/prisma"
import { formatRupiah } from "@/utils/RupiahFormater";

interface propsGetMyTransactions {
    user_id: number,
    page?: number,
    query?: string
}

export const getMyTransactions = async ({ 
    query = "",
    user_id,
    page = 1 
}: propsGetMyTransactions) => {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = {
        user_id: user_id,
        OR: [
            { user_booking: { contains: query, mode: "insensitive" } },
            { wa_booking: { contains: query, mode: "insensitive" } },
            { kamar: { nama_kamar: { contains: query, mode: "insensitive" } } },
            { hotel: { nama_hotel: { contains: query, mode: "insensitive" } } }
        ]
    };

    try {
        const parsedDate = new Date(query);
        if (!isNaN(parsedDate.getTime())) {
            whereConditions.OR.push(
                { tanggal_checkin: { equals: parsedDate } },
                { tanggal_checkout: { equals: parsedDate } }
            );
        }
    } catch (error) {}

    const totalTransactions = await prisma.booking.count({
        where: whereConditions
    });

    const res = await prisma.booking.findMany({
        where: whereConditions,
        include: {
            kamar: true,
            hotel: true
        },
        skip,
        take: pageSize,
        orderBy: {
            createdAt: "desc"
        }
    });

    const parseResponse = res.map((transaction) => ({
        id: transaction.id,
        hotel: transaction.hotel.nama_hotel,
        kamar: transaction.kamar.nama_kamar,
        pemesan: transaction.user_booking,
        whatsapp: transaction.wa_booking,
        check_in: formatDateWithDay(transaction.tanggal_checkin),
        check_out: formatDateWithDay(transaction.tanggal_checkout),
        total: formatRupiah(transaction.price_total),
        tanggal_pesan: formatDateWithDay(transaction.createdAt)
    }));

    return {
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / pageSize),
        totalData: totalTransactions,
        data: parseResponse
    };
};