import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { blipAbi } from 'constants/contract';
import { VIEM_PROVIDER, ViemProvider } from 'src/provider/provider.viem';
import { Address } from 'viem';

@Injectable()
export class BlockchainService implements OnModuleInit {
  onModuleInit() {
    this.watchEvent();
  }

  constructor(@Inject(VIEM_PROVIDER) private readonly viem: ViemProvider) {}

  async watchEvent() {
    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519' as Address,
      eventName: 'GuardianLeftRole',
      onLogs: (log) => {
        const recipient = log[0];
        const guardian = log[1];
      },
    });
  }
}
