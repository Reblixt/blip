import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(senderWallet?: string, recipientWallet?: string) {
    const where: any = {};

    if (senderWallet) {
      where.senderWallet = senderWallet;
    }

    if (recipientWallet) {
      where.recipientWallet = recipientWallet;
    }

    return this.prisma.payments.findMany({
      where,
      include: { sender: true, recipient: true, approvals: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.payments.findUnique({
      where: { id },
      include: {
        sender: true,
        recipient: true,
        approvals: true,
      },
    });
  }

  async create(
    dto: CreatePaymentDto,
    senderWallet: string,
    contractId?: number
  ) {
    const payment = await this.prisma.payments.create({
      data: {
        contractId: contractId,
        senderWallet: senderWallet,
        recipientWallet: dto.recipientWallet,
        amount: dto.amount,
        tokenAddress: dto.tokenAddress,
        message: dto.message,
        status: 'pending',
      },
    });

    const guardians = await this.prisma.userGuardians.findMany({
      where: {
        recipientWallet: dto.recipientWallet,
        status: 'active',
      },
    });

    await this.prisma.paymentApprovals.createMany({
      data: guardians.map((guardian) => ({
        paymentId: payment.id,
        guardianWallet: guardian.guardianWallet,
        approved: false,
      })),
    });

    return payment;
  }

  async approve(paymentId: string, guardianWallet: string) {
    const approval = await this.prisma.paymentApprovals.update({
      where: {
        paymentId_guardianWallet: {
          paymentId: paymentId,
          guardianWallet: guardianWallet,
        },
      },
      data: {
        approved: true,
      },
    });

    const approvedCount = await this.prisma.paymentApprovals.count({
      where: {
        paymentId: paymentId,
        approved: true,
      },
    });

    const totalGuardians = await this.prisma.paymentApprovals.count({
      where: {
        paymentId: paymentId,
      },
    });

    if (approvedCount === totalGuardians) {
      await this.prisma.payments.update({
        where: { id: paymentId },
        data: {
          status: 'approved',
        },
      });
    }

    return this.prisma.payments.findUnique({
      where: { id: paymentId },
      include: {
        sender: true,
        recipient: true,
        approvals: true,
      },
    });
  }

  async approveByContractId(contractId: number, guardianWallet: string) {
    const payment = await this.prisma.payments.findUnique({
      where: { contractId: contractId },
    });

    if (!payment) {
      throw new Error(`Payment with contractId ${contractId} not found`);
    }

    return this.approve(payment.id, guardianWallet);
  }

  async releasePayment(contractId: number) {
    const payment = await this.prisma.payments.findUnique({
      where: { contractId },
    });

    const updatedPayment = await this.prisma.payments.update({
      where: { id: payment.id },
      data: { status: 'released' },
      include: {
        sender: true,
        recipient: true,
        approvals: true,
      },
    });

    return updatedPayment;
  }

  async rejectByContractId(contractId: number) {
    const updatedPayment = await this.prisma.payments.update({
      where: { contractId },
      data: { status: 'rejected' },
      include: {
        sender: true,
        recipient: true,
        approvals: true,
      },
    });

    return updatedPayment;
  }

  async cancel(paymentId: string) {
    const payment = await this.prisma.payments.findUnique({
      where: { id: paymentId },
    });

    if (payment.status !== 'pending') {
      throw new Error('Only pending payments can be cancelled');
    }

    await this.prisma.payments.update({
      where: { id: paymentId },
      data: {
        status: 'refunded',
      },
    });

    return this.prisma.payments.findUnique({
      where: { id: paymentId },
      include: {
        sender: true,
        recipient: true,
        approvals: true,
      },
    });
  }
}
