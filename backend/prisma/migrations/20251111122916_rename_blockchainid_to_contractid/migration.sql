/*
  Warnings:

  - You are about to drop the column `blockchainId` on the `Payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Payments_blockchainId_key";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "blockchainId",
ADD COLUMN     "contractId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_contractId_key" ON "Payments"("contractId");
