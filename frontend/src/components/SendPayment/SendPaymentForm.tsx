import { useState, useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useAccount,
  useReadContract,
} from 'wagmi';
import { blipAbi } from '@/contracts/Blip';
import { erc20Abi } from '@/contracts/MockERC20';
import { getBlipAddress } from '@/contracts/addresses';
import { getTokensForChain } from '@/contracts/tokens';
import { parseEther, parseUnits, formatUnits, Address } from 'viem';
import { Send, Loader2, CheckCircle, Check } from 'lucide-react';

export function SendPaymentForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState<'native' | number>(
    'native'
  );

  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  const blipAddress = getBlipAddress(chainId);
  const { native, tokens } = getTokensForChain(chainId);

  const isNative = selectedToken === 'native';
  const currentToken = isNative ? native : tokens[selectedToken as number];
  const tokenAddress = isNative
    ? null
    : tokens[selectedToken as number].address;

  const { data: tokenBalance } = useReadContract({
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !isNative && !!userAddress && !!tokenAddress,
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress ? [userAddress, blipAddress] : undefined,
    query: {
      enabled: !isNative && !!userAddress && !!tokenAddress,
    },
  });

  const {
    data: approveHash,
    writeContract: approveToken,
    isPending: isApproving,
  } = useWriteContract();

  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const {
    data: paymentHash,
    writeContract: sendPayment,
    isPending: isSending,
  } = useWriteContract();

  const { isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash: paymentHash,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      setTimeout(() => {
        refetchAllowance();
      }, 1000);
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isPaymentSuccess) {
      setAmount('');
      setMessage('');
      setRecipient('');
    }
  }, [isPaymentSuccess]);

  const handleApprove = () => {
    if (!tokenAddress || !amount || parseFloat(amount) <= 0) return;

    const approveAmount = parseUnits(amount, currentToken.decimals);

    approveToken({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [blipAddress, approveAmount],
    });
  };

  const handleSendPayment = () => {
    if (!amount || parseFloat(amount) <= 0 || !recipient) return;

    if (isNative) {
      sendPayment({
        abi: blipAbi,
        address: blipAddress,
        functionName: 'initPayment',
        args: [recipient as Address, parseEther(amount), message],
        value: parseEther(amount),
      });
    } else {
      const tokenAmount = parseUnits(amount, currentToken.decimals);
      sendPayment({
        abi: blipAbi,
        address: blipAddress,
        functionName: 'initPayment',
        args: [
          tokenAddress as Address,
          recipient as Address,
          tokenAmount,
          message,
        ],
      });
    }
  };

  const needsApproval = () => {
    if (isNative) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (!allowance) return true;

    const requiredAmount = parseUnits(amount, currentToken.decimals);
    return BigInt(allowance.toString()) < BigInt(requiredAmount.toString());
  };

  const formattedBalance = () => {
    if (isNative) return 'N/A';
    if (!tokenBalance) return '0';
    return formatUnits(BigInt(tokenBalance.toString()), currentToken.decimals);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
        <div className='w-full max-w-md space-y-4'>
          <select
            value={selectedToken}
            onChange={(e) =>
              setSelectedToken(
                e.target.value === 'native' ? 'native' : Number(e.target.value)
              )
            }
            className='w-full px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50'>
            <option value='native'>
              {native.symbol} ({native.name})
            </option>
            {tokens.map((token, index) => (
              <option key={token.address} value={index}>
                {token.symbol} ({token.name})
              </option>
            ))}
          </select>

          {!isNative && (
            <div className='px-6 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Balance: {formattedBalance()} {currentToken.symbol}
              </p>
            </div>
          )}

          <input
            type='text'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='0.00'
            className='w-full px-6 py-4 text-2xl font-semibold bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50'
          />

          <input
            type='text'
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder='Recipient address'
            className='w-full px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50'
          />

          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Message (optional)'
            className='w-full px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50'
          />

          {isApproveSuccess && !isPaymentSuccess && (
            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-lg'>
              <p className='text-blue-800 dark:text-blue-300 text-center font-medium flex items-center justify-center gap-2'>
                <Check size={20} />
                Approval successful! Now send payment.
              </p>
            </div>
          )}

          {isPaymentSuccess && (
            <div className='p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-lg'>
              <p className='text-green-800 dark:text-green-300 text-center font-medium flex items-center justify-center gap-2'>
                <CheckCircle size={20} />
                Payment sent successfully!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='fixed bottom-24 left-0 right-0 flex justify-center z-40 px-4 gap-2'>
        {!isNative && needsApproval() && (
          <button
            onClick={handleApprove}
            disabled={isApproving || !amount || parseFloat(amount) <= 0}
            className='flex-1 sm:flex-none bg-yellow-500 text-white px-6 py-4 sm:py-3 text-lg sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
            {isApproving ? (
              <>
                <Loader2 size={24} className='animate-spin' />
                <span className='font-semibold'>Approving...</span>
              </>
            ) : (
              <>
                <Check size={24} />
                <span className='font-semibold'>
                  Approve {currentToken.symbol}
                </span>
              </>
            )}
          </button>
        )}

        <button
          onClick={handleSendPayment}
          disabled={
            isSending ||
            !amount ||
            parseFloat(amount) <= 0 ||
            !recipient ||
            (!isNative && needsApproval())
          }
          className='flex-1 sm:flex-none bg-blue-500 text-white px-6 py-4 sm:py-3 text-lg sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
          {isSending ? (
            <>
              <Loader2 size={24} className='animate-spin' />
              <span className='font-semibold'>Sending...</span>
            </>
          ) : (
            <>
              <Send size={24} />
              <span className='font-semibold'>Send {currentToken.symbol}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
