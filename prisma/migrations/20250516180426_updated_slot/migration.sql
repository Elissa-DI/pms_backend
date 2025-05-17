/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORCYCLE', 'CAR', 'TRUCK');

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "size" "SlotSize" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Slot_number_key" ON "Slot"("number");
