import { PrismaModule } from 'src/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProviderModule } from 'src/provider/provider.module';
import { BlockchainService } from './blockchain.service';
import { UsersModule } from 'src/users/users.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [ProviderModule, PrismaModule, UsersModule, PaymentsModule],
  providers: [BlockchainService],
})
export class BlockchainModule {}
