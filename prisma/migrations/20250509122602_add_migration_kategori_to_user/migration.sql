/*
  Warnings:

  - Added the required column `user_id` to the `KategoriKamar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KategoriKamar" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "KategoriKamar" ADD CONSTRAINT "KategoriKamar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
