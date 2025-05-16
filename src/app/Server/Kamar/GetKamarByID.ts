import { prisma } from "@/utils/prisma";

export async function getKamarById(idKamar : number){
    try {
        const res = await prisma.kamarInHotel.findFirst({
            where : {
                id : idKamar
            },
        })
        return res
    } catch (error) {
        console.error("Error get detail kamar:", error);
    }
}