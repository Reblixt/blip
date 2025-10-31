import { Module } from '@nestjs/common'
import { ProviderModule } from 'src/provider/provider.module'
import { BlockchainService } from './blockchain.service'

@Module({
  imports: [ProviderModule],
  providers: [BlockchainService],
})
export class BlockchainModule {}
