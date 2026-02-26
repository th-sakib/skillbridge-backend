/*
  Warnings:

  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `endMinute` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMinute` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_tutorId_fkey";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endMinute" INTEGER NOT NULL,
ADD COLUMN     "startMinute" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
