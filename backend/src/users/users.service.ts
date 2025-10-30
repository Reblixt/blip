import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from 'generated/prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name)

  async findAll() {
    return this.prisma.users.findMany()
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async create(userData: Prisma.UsersCreateInput) {
    return this.prisma.users.create({
      data: userData,
    })
  }

  async update(id: string, updateData: Prisma.UsersUpdateInput) {
    //TODO: Remove unneded code. and add try catch or dot.catch
    await this.findOne(id)
    //TODO: add await
    return this.prisma.users.update({
      where: {
        id,
      },
      data: updateData,
    })
  }

  async remove(id: string) {
    //TODO: Do not forget this
    return await this.prisma.users.delete({ where: { id } })
  }
}
