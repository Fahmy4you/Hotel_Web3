-- CreateTable
CREATE TABLE "ProfilePict" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "images" TEXT NOT NULL,

    CONSTRAINT "ProfilePict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePict_user_id_key" ON "ProfilePict"("user_id");

-- AddForeignKey
ALTER TABLE "ProfilePict" ADD CONSTRAINT "ProfilePict_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
