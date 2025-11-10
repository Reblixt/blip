import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name);

  // BLOCKCHAIN LISTENER METHODS

  async proposeGuardianByWallet(
    recipientWallet: string,
    guardianWallet: string
  ) {
    await this.upsertUser(recipientWallet);
    await this.upsertUser(guardianWallet);

    return this.prisma.userGuardians.create({
      data: {
        recipientWallet: recipientWallet,
        guardianWallet: guardianWallet,
        status: 'pending',
      },
    });
  }

  async acceptGuardianRoleByWallets(
    recipientWallet: string,
    guardianWallet: string
  ) {
    return this.prisma.userGuardians.update({
      where: {
        // ← Fyll i här! Hur hittar du raden med båda wallet-adresserna?
        recipientWallet_guardianWallet: {
          recipientWallet,
          guardianWallet,
        },
      },
      data: { status: 'active' },
    });
  }

  async removeGuardianRelationByWallets(
    recipientWallet: string,
    guardianWallet: string
  ) {
    return this.prisma.userGuardians.deleteMany({
      where: { recipientWallet, guardianWallet },
    });
  }

  // API CONTROLLER METHODS
  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        walletAddress: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(userData: Prisma.UsersCreateInput) {
    return this.prisma.users.create({
      data: userData,
    });
  }

  async update(id: string, updateData: Prisma.UsersUpdateInput) {
    try {
      return await this.prisma.users.update({
        where: { walletAddress: id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.users.delete({ where: { walletAddress: id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getGuardians(userId: string) {
    const user = await this.prisma.userGuardians.findMany({
      where: {
        recipientWallet: userId,
      },
    });

    return user;
  }

  async acceptGuardianRole(guardianRelationId: string) {
    return await this.prisma.userGuardians.update({
      where: { id: guardianRelationId },
      data: { status: 'active' },
    });
  }

  async declineGuardianRole(guardianRelationId: string) {
    return await this.prisma.userGuardians.delete({
      where: { id: guardianRelationId },
    });
  }
  async upsertUser(walletAddress: string) {
    let user = await this.prisma.users.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          walletAddress,
        },
      });
    }

    return user;
  }
}
