"use server"
import { prisma } from '@/utils/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function AddUser(userData : FormData) {
    const nama = userData.get('nama') as string;
    const wallet_address = userData.get('wallet_address') as string;
    const no_wa = userData.get('no_wa') as string;

  try {
    const users = await prisma.user.create({
        data : {
            nama: nama,
            no_wa: no_wa,
            wallet_address: wallet_address,
            role_id: 1,
            is_active: true,
            createdAt: new Date(),
        }
    })
    
    revalidatePath('/dashboard/admin/users');
    revalidateTag('users');

    return {
        succces : true,
        message : "User Created",
        data : users
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add users");
  }
}
