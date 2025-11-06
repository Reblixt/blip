import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(senderId?: string, recipientId?: string) {
    const where: any = {};

    if (senderId) {
      where.senderId = senderId;
    }

    if (recipientId) {
      where.recipientId = recipientId;
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

  async create(dto: CreatePaymentDto, senderId: string) {
    const payment = await this.prisma.payments.create({
      data: {
        senderId: senderId,
        recipientId: dto.recipientId,
        amount: dto.amount,
        tokenAddress: dto.tokenAddress,
        message: dto.message,
        status: 'pending',
      },
    });

    const guardians = await this.prisma.userGuardians.findMany({
      where: {
        recipientId: dto.recipientId,
        status: 'active',
      },
    });

    await this.prisma.paymentApprovals.createMany({
      data: guardians.map((guardian) => ({
        paymentId: payment.id,
        guardianId: guardian.guardianId,
        approved: false,
      })),
    });

    return payment;
  }
  async approve(paymentId: string, guardianId: string) {
    const approval = await this.prisma.paymentApprovals.update({
      where: {
        paymentId_guardianId: {
          paymentId: paymentId,
          guardianId: guardianId,
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

  async reject(paymentId: string, guardianId: string) {
    // 1. Uppdatera approval till false
    const approval = await this.prisma.paymentApprovals.update({
      where: {
        paymentId_guardianId: {
          paymentId: paymentId,
          guardianId: guardianId,
        },
      },
      data: {
        approved: false,
      },
    });

    await this.prisma.payments.update({
      where: { id: paymentId },
      data: {
        status: 'rejected',
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
