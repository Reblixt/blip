import { Provider } from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { anvil } from 'viem/chains';

export const VIEM_PROVIDER = 'VIEM_PROVIDER';

export type ViemProvider = PublicClient;

export const ViemProvider: Provider = {
  provide: VIEM_PROVIDER,
  useFactory: () =>
    createPublicClient({
      chain: anvil,
      transport: http(),
    }),
};
