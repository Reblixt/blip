import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGuardianDto } from './dto/create-guardian.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':userId/guardians')
  async addGuardian(
    @Param('userId') userId: string,
    @Body() createGuardianDto: CreateGuardianDto
  ) {
    const guardianWallet = createGuardianDto.guardianWallet;
    return this.usersService.proposeGuardianByWallet(userId, guardianWallet);
  }

  @Get(':userId/guardians')
  async getGuardian(@Param('userId') userId: string) {
    return this.usersService.getGuardians(userId);
  }

  @Patch('guardians/:guardianRelationId/accept')
  async acceptGuardianRole(@Param('guardianRelationId') id: string) {
    return this.usersService.acceptGuardianRole(id);
  }

  @Patch('guardians/:guardianRelationId/decline')
  async declineGuardianRole(@Param('guardianRelationId') id: string) {
    return this.usersService.declineGuardianRole(id);
  }

  @Delete(':userId/guardians/:guardianWallet')
  async removeGuardian(
    @Param('guardianWallet') guardianWallet: string,
    @Param('userId') userId: string
  ) {
    return this.usersService.removeGuardianRelationByWallets(
      userId,
      guardianWallet
    );
  }

  @Delete(':userId/guardians/:guardianRelationId')
  async removeGuardianByWallets(
    @Param('guardianRelationId') guardianWallet: string,
    @Param('userId') recipientWallet: string
  ) {
    return this.usersService.removeGuardianRelationByWallets(
      recipientWallet,
      guardianWallet
    );
  }
}
