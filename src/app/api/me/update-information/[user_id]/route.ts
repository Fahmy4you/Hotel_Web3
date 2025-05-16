import {prisma} from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: {
        user_id: string;
    };
}

export async function PUT(req: Request, { params }: Params) {
    try {
    const userId = await params.user_id;
    const formdata = await req.formData();
    const nama_user = formdata.get('nama_user') as string;
    const email = formdata.get('email') as string;
    const phone = formdata.get('no_whatsapp') as string;

    const user = await prisma.user.update({
        where: {
            id: Number(userId)
        },
        data: {
            nama: nama_user,
            email: email,
            no_wa: phone,
        }
    })
    return NextResponse.json(user)    
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Error updating user" }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
}