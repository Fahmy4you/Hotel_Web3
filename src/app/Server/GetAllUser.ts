"use server"
import { prisma } from '@/utils/prisma';


export async function GetAllUser() {
    try {
        const users = await prisma.user.findMany();
        console.log(users);
        return users;
    } catch (error) {
        console.error(error);
    }
}