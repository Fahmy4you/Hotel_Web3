"use server";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: number) {
    try {
        const user = await prisma.user.delete({
        where: { id },
        });

        revalidatePath("dashboard/admin/users");
        return user;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}