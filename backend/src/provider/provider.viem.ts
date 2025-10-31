import { Provider } from '@nestjs/common'
import { createPublicClient, http } from 'viem'
import { anvil } from 'viem/chains'

export const VIEM_PROVIDER = 'VIEM_PROVIDER'

export type ViemProvider = typeof createPublicClient

export const ViemProvider: Provider = {
  provide: VIEM_PROVIDER,
  useFactory: () =>
    createPublicClient({
      chain: anvil,
      transport: http(),
    }),
}
