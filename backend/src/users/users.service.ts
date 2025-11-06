import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name);

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
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
        where: { id },
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
      return await this.prisma.users.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async proposeGuardian(recipientId: string, guardianId: string) {
    return this.prisma.userGuardians.create({
      data: {
        recipientId,
        guardianId,
        status: 'pending',
      },
    });
  }

  async getGuardians(userId: string) {
    const user = await this.prisma.userGuardians.findMany({
      where: {
        recipientId: userId,
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

  async removeGuardian(recipientId: string, guardianId: string) {
    return await this.prisma.userGuardians.deleteMany({
      where: { recipientId, guardianId },
    });
  }
}
