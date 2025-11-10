/*
  Warnings:

  - You are about to drop the column `guardianId` on the `PaymentApprovals` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `guardianId` on the `UserGuardians` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `UserGuardians` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId,guardianWallet]` on the table `PaymentApprovals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipientWallet,guardianWallet]` on the table `UserGuardians` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guardianWallet` to the `PaymentApprovals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientWallet` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderWallet` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guardianWallet` to the `UserGuardians` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientWallet` to the `UserGuardians` table without a default value. This is not possible if the table is not empty.
  - Made the column `walletAddress` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."PaymentApprovals" DROP CONSTRAINT "PaymentApprovals_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payments" DROP CONSTRAINT "Payments_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payments" DROP CONSTRAINT "Payments_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserGuardians" DROP CONSTRAINT "UserGuardians_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserGuardians" DROP CONSTRAINT "UserGuardians_recipientId_fkey";

-- DropIndex
DROP INDEX "public"."PaymentApprovals_paymentId_guardianId_key";

-- DropIndex
DROP INDEX "public"."UserGuardians_recipientId_guardianId_key";

-- DropIndex
DROP INDEX "public"."Users_walletAddress_key";

-- AlterTable
ALTER TABLE "PaymentApprovals" DROP COLUMN "guardianId",
ADD COLUMN     "guardianWallet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "recipientId",
DROP COLUMN "senderId",
ADD COLUMN     "hasViewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipientWallet" TEXT NOT NULL,
ADD COLUMN     "senderWallet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserGuardians" DROP COLUMN "guardianId",
DROP COLUMN "recipientId",
ADD COLUMN     "guardianWallet" TEXT NOT NULL,
ADD COLUMN     "recipientWallet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "id",
ALTER COLUMN "walletAddress" SET NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentApprovals_paymentId_guardianWallet_key" ON "PaymentApprovals"("paymentId", "guardianWallet");

-- CreateIndex
CREATE UNIQUE INDEX "UserGuardians_recipientWallet_guardianWallet_key" ON "UserGuardians"("recipientWallet", "guardianWallet");

-- AddForeignKey
ALTER TABLE "UserGuardians" ADD CONSTRAINT "UserGuardians_recipientWallet_fkey" FOREIGN KEY ("recipientWallet") REFERENCES "Users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGuardians" ADD CONSTRAINT "UserGuardians_guardianWallet_fkey" FOREIGN KEY ("guardianWallet") REFERENCES "Users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_senderWallet_fkey" FOREIGN KEY ("senderWallet") REFERENCES "Users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_recipientWallet_fkey" FOREIGN KEY ("recipientWallet") REFERENCES "Users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentApprovals" ADD CONSTRAINT "PaymentApprovals_guardianWallet_fkey" FOREIGN KEY ("guardianWallet") REFERENCES "Users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
