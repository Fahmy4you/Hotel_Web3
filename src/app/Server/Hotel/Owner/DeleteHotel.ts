"use server";
import { prisma } from "@/utils/prisma";
// import { revalidatePath } from "next/cache";

export async function deleteHotel(id: number) {
    try {
        const user = await prisma.hotel.delete({
        where: { id },
        });

        // revalidatePath("dashboard/admin/users");
        return user;
    } catch (error) {
        console.error("Error deleting hotels:", error);
        throw new Error("Failed to delete hotel");
    }
}