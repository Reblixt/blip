import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll(
    @Query('senderWallet') senderWallet?: string,
    @Query('recipientWallet') recipientWallet?: string
  ) {
    return this.paymentsService.findAll(senderWallet, recipientWallet);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    const senderWallet = 'cmhnsr9en0000uxgbbrnfyh7b'; // Placeholder
    return this.paymentsService.create(dto, senderWallet);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body('guardianId') guardianId: string) {
    return this.paymentsService.approve(id, guardianId);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body('guardianId') guardianId: string) {
    return this.paymentsService.reject(id, guardianId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.paymentsService.cancel(id);
  }
}
