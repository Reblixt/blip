/*
  Warnings:

  - A unique constraint covering the columns `[blockchainId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "blockchainId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_blockchainId_key" ON "Payments"("blockchainId");
