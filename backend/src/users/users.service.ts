import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    await this.findOne(id);

    return this.prisma.users.update({
      where: {
        id,
      },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.users.delete({ where: { id } });
  }
}
