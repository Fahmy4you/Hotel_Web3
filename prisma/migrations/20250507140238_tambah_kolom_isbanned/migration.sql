/*
  Warnings:

  - Added the required column `is_banned` to the `KamarInHotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KamarInHotel" ADD COLUMN     "is_banned" BOOLEAN NOT NULL;
