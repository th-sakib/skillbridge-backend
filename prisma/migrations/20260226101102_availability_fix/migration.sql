/*
  Warnings:

  - Changed the type of `day` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;

-- CreateIndex
CREATE INDEX "Availability_day_idx" ON "Availability"("day");
