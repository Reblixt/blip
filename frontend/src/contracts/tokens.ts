import { Address } from 'viem';

export type TokenConfig = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
};

export type NetworkTokens = {
  native: {
    symbol: string;
    name: string;
    decimals: number;
  };
  tokens: TokenConfig[];
};

// Anvil (local development)
const ANVIL_TOKENS: NetworkTokens = {
  native: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
  },
  tokens: [
    {
      address: process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS as Address,
      symbol: 'mUSDC',
      name: 'Mock USDC',
      decimals: 6,
    },
  ],
};

// Polygon Amoy Testnet
const POLYGON_AMOY_TOKENS: NetworkTokens = {
  native: {
    symbol: 'POL',
    name: 'Polygon',
    decimals: 18,
  },
  tokens: [
    {
      address: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
  ],
};

// Polygon Mainnet
const POLYGON_MAINNET_TOKENS: NetworkTokens = {
  native: {
    symbol: 'POL',
    name: 'Polygon',
    decimals: 18,
  },
  tokens: [
    {
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
  ],
};

export const SUPPORTED_TOKENS: Record<number, NetworkTokens> = {
  31337: ANVIL_TOKENS, // Anvil
  80002: POLYGON_AMOY_TOKENS, // Polygon Amoy Testnet
  137: POLYGON_MAINNET_TOKENS, // Polygon Mainnet
};

export function getTokensForChain(chainId: number): NetworkTokens {
  return SUPPORTED_TOKENS[chainId] || ANVIL_TOKENS;
}
