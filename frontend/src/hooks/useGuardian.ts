import { useWriteContract, useChainId } from 'wagmi';
import { blipAbi } from '@/contracts/Blip';
import { getBlipAddress } from '@/contracts/addresses';
import { Address } from 'viem';

export interface Guardian {
  id: string;
  recipientWallet: string;
  guardianWallet: string;
  status: string;
  createdAt: string;
}

export const useGuardian = (guardian: Guardian) => {
  const { data: hash, writeContract } = useWriteContract();
  const chainId = useChainId();
  const blipAddress = getBlipAddress(chainId);

  const handleCancelGuardianProposal = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'cancelGuardianProposal',
      args: [guardian.guardianWallet as Address],
    });
  };

  const handleRemoveGuardian = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'removeGuardian',
      args: [guardian.guardianWallet as Address],
    });
  };

  const handleAcceptGuardianRole = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'acceptGuardianRole',
      args: [guardian.recipientWallet as Address],
    });
  };

  const handleDeclineGuardianRole = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'declineGuardianRole',
      args: [guardian.recipientWallet as Address],
    });
  };

  const handleLeaveGuardianRole = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'leaveGuardianRole',
      args: [guardian.recipientWallet as Address],
    });
  };

  return {
    handleCancelGuardianProposal,
    handleRemoveGuardian,
    handleAcceptGuardianRole,
    handleDeclineGuardianRole,
    handleLeaveGuardianRole,
    hash,
  };
};
