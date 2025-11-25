import { Address } from 'viem';

type ContractAddresses = {
  blip: Address;
  mockToken?: Address;
};

export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Anvil (local)
  31337: {
    blip: process.env.NEXT_PUBLIC_BLIP_CONTRACT_ADDRESS as Address,
    mockToken: process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS as Address,
  },

  // Polygon Amoy Testnet
  80002: {
    blip: '0x0000000000000000000000000000000000000000' as Address,
  },

  // Polygon Mainnet
  137: {
    blip: '0x0000000000000000000000000000000000000000' as Address,
  },
};

export function getBlipAddress(chainId: number): Address {
  const address = CONTRACT_ADDRESSES[chainId]?.blip;
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    console.warn(
      `Blip contract not deployed on chain ${chainId}, using Anvil address`
    );
    return CONTRACT_ADDRESSES[31337].blip;
  }
  return address;
}
