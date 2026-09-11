/*
  Warnings:

  - You are about to drop the column `tutorId` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `tutorProfileId` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_tutorId_fkey";

-- DropIndex
DROP INDEX "Availability_tutorId_idx";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "tutorId",
ADD COLUMN     "tutorProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Availability_tutorProfileId_idx" ON "Availability"("tutorProfileId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "tutorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
