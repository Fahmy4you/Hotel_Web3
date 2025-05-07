"use server"
import { prisma } from '@/utils/prisma';

interface GetAllUserParams {
  search?: string;
  page?: number;
}

export async function GetAllUser({ search = '', page = 1 }: GetAllUserParams) {
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { no_wa: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { no_wa: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    return {
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize),
      totalUsers,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
}
