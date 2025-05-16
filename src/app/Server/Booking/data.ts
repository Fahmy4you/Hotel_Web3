"use server"
import { prisma } from "@/utils/prisma";

export const getBookingDataByKamarIdForCheck = async (kamar_id: number) => {
    const data = await prisma.booking.findMany({
        where: {
            kamar_id
        },
        select: {
            tanggal_checkin: true,
            tanggal_checkout: true
        }
    })

    return data;
}

export const getBookingByKamarId = async ({page = 1, limit = 12, search = '', kamar_id}: {page: number, limit: number, search: string, kamar_id: number}) => {
    const offset = (page - 1) * limit;

    const whereCondition: any = {
        kamar_id,
        ...(search && {
        OR: [
            { user_booking: { contains: search, mode: "insensitive" } },
        ],
        }),
    };

    const totalData = await prisma.booking.count({
        where: whereCondition,
    });

    const totalPage = Math.ceil(totalData / limit);

    const data = await prisma.booking.findMany({
        where: whereCondition,
        select: {
            id: true,
            user_booking: true,
            tanggal_checkin: true,
            tanggal_checkout: true
        },
        orderBy: {
            tanggal_checkin: 'asc',
        },
        skip: offset,
        take: limit,
    });

    return {
        data,
        totalPage,
        totalData,
        currentPage: page,
    };
}

export const createDataBooking = async (id: number, kamar_id: number, hotel_id: number, user_id: number, user_booking: string, wa_booking: string, tanggal_checkin: string, tanggal_checkout: string, price_total: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/booking/add_booking`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id,
            kamar_id,
            hotel_id,
            user_id,
            user_booking,
            wa_booking,
            tanggal_checkin,
            tanggal_checkout,
            price_total
        })
        
    })

    return await res.json();
}

export const deleteBooking = async (id: number) => {
    const res =  await fetch(`${process.env.NEXT_PUBLIC_URL_API}/booking/delete_booking`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id
        })
    })

    return await res.json();
}