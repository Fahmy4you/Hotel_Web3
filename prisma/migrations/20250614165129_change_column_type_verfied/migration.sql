/*
  Warnings:

  - You are about to drop the column `isEmail_verified` on the `Verified_Account` table. All the data in the column will be lost.
  - You are about to drop the column `isNoWa_verified` on the `Verified_Account` table. All the data in the column will be lost.
  - Added the required column `Email_verified` to the `Verified_Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NoWa_verified` to the `Verified_Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verified_Account" DROP COLUMN "isEmail_verified",
DROP COLUMN "isNoWa_verified",
ADD COLUMN     "Email_verified" TEXT NOT NULL,
ADD COLUMN     "NoWa_verified" TEXT NOT NULL;
