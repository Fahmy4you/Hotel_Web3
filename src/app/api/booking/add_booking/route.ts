import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getBookingDataByKamarIdForCheck } from "@/app/Server/Booking/data";

export async function POST(request: NextRequest) {
    try {
        let body = await request.json();

        if(!body.id && !body.kamar_id && !body.hotel_id && !body.user_id && !body.user_booking && !body.wa_booking && !body.tanggal_checkin && !body.tanggal_checkout && !body.price_total) return NextResponse.json({ message: "Data Yang Diberikan Tidak Valid" }, { status: 422 });

        body.tanggal_checkin = new Date(body.tanggal_checkin)
        body.tanggal_checkout = new Date(body.tanggal_checkout)

        const dataBooking = await getBookingDataByKamarIdForCheck(body.kamar_id);
        const isDateConflict = dataBooking.some((booking: {tanggal_checkin: Date, tanggal_checkout: Date}) => {
            const existingStart = new Date(booking.tanggal_checkin);
            const existingEnd = new Date(booking.tanggal_checkout);
            const newStart = body.tanggal_checkin as Date;
            const newEnd = body.tanggal_checkout as Date;

            return (
                (newStart >= existingStart && newStart <= existingEnd) ||
                (newEnd >= existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            );
        });

        if(isDateConflict) {
            return NextResponse.json({sukses: false, message: "Kamar Ini Sudah Dibooking DI Tanggal Tersebut" }, { status: 400 });
        }

        await prisma.booking.create({
            data: body
        })

        return NextResponse.json({sukses: true, message: "Berhasil Booking" }, { status: 200 });
    } catch(e) {
        console.error("Error Add Booking in:", e);
        return NextResponse.json({sukses: false, message: "Create Internal server error" }, { status: 500 });
    }
}