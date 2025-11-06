-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserGuardians" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGuardians_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGuardians_recipientId_guardianId_key" ON "UserGuardians"("recipientId", "guardianId");

-- AddForeignKey
ALTER TABLE "UserGuardians" ADD CONSTRAINT "UserGuardians_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGuardians" ADD CONSTRAINT "UserGuardians_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
