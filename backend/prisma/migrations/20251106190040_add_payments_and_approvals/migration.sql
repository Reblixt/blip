-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL,
    "blockchainTxHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentApprovals" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentApprovals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentApprovals_paymentId_guardianId_key" ON "PaymentApprovals"("paymentId", "guardianId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentApprovals" ADD CONSTRAINT "PaymentApprovals_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentApprovals" ADD CONSTRAINT "PaymentApprovals_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
