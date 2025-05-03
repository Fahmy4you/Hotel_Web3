import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: [
      { id: 1, role: 'Pengunjung' },
      { id: 2, role: 'Pemilik Hotel' },
      { id: 3, role: 'Admin App' }
    ],
    skipDuplicates: true
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
