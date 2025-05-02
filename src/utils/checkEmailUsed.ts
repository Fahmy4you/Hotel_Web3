import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkEmailUsed = async ( email: string, forUpdate: boolean = false, userId: number | null = null): Promise<boolean> => {
    const user = await prisma.user.findFirst({
        where: { email: email },
    });

    if (!forUpdate) {
        return user !== null;
    }
    return user !== null && user.id!== userId;
};