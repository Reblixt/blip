import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { blipAbi } from 'constants/contract';
import { VIEM_PROVIDER, ViemProvider } from 'src/provider/provider.viem';
import { Address } from 'viem';

@Injectable()
export class BlockchainService implements OnModuleInit {
  constructor(@Inject(VIEM_PROVIDER) private readonly viem: ViemProvider) {}
  private readonly logger = new Logger(BlockchainService.name);

  async onModuleInit() {
    await this.watchEvent();
  }

  async watchEvent() {
    this.logger.debug('Starting to watch GuardianProposed events...');

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianProposed',
      onLogs: (log) => {
        const recipient = log[0];
        const guardian = log[1];

        this.logger.debug(
          `GuardianProposed event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
      },
      onError: (error) => {
        this.logger.error(
          `Error watching GuardianProposed events: ${error.message}`
        );
      },
    });
  }
}
