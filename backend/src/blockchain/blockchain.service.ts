import { Inject, Injectable } from '@nestjs/common';
import { VIEM_PROVIDER, ViemProvider } from 'src/provider/provider.viem';
import { Address } from 'viem';

@Injectable()
export class BlockchainService {
  constructor(@Inject(VIEM_PROVIDER) private readonly viem: ViemProvider){}


  async watchEvent() {
    this.viem().watchContractEvent({
      abi: blipAbi,
      address: '' as Address,
      eventName: "GuardianLeftRole",
      onLogs: (log) => {
        const recipient = log[0]
        const guardian = log[1]


      }


    })
  }
}
