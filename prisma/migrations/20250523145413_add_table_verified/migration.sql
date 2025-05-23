-- CreateTable
CREATE TABLE "Verified_Account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "isEmail_verified" BOOLEAN NOT NULL,
    "isNoWa_verified" BOOLEAN NOT NULL,

    CONSTRAINT "Verified_Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verified_Account_user_id_key" ON "Verified_Account"("user_id");

-- AddForeignKey
ALTER TABLE "Verified_Account" ADD CONSTRAINT "Verified_Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
