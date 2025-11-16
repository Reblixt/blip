'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { anvil, mainnet, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia, anvil],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [anvil.id]: http(),
  },
});

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      {children}
    </WagmiProvider>
  );
}
