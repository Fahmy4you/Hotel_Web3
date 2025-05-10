/*
  Warnings:

  - Added the required column `is_banned` to the `KategoriKamar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KategoriKamar" ADD COLUMN     "is_banned" BOOLEAN NOT NULL;
