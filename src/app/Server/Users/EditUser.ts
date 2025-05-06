"use server";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function editUser(id: number, data: any) {
    try {
        const user = await prisma.user.update({
        where: { id },
        data: {
            nama: data.nama,
            wallet_address: data.wallet_address,
            no_wa: data.no_wa,
        },
        });

        revalidatePath("dashboard/admin/users");
        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
}