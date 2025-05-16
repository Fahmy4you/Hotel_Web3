import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if(!body.id) return NextResponse.json({sukses: false, message: "ID harus dicantumkan" }, { status: 422 });

        await prisma.booking.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json({sukses: true, message: "Berhasil Hapus Booking" }, { status: 200 });

    } catch(e) {
        console.error("Error Add Booking in:", e);
        return NextResponse.json({sukses: false, message: "Delete Internal server error" }, { status: 500 });
    }
}