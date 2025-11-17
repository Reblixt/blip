import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { blipAbi, BLIP_CONTRACT_ADDRESS } from '@/contracts/Blip';
import { parseEther } from 'viem';
import { Send, Loader2 } from 'lucide-react';

export function SendPaymentForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSendPayment = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    writeContract({
      abi: blipAbi,
      address: BLIP_CONTRACT_ADDRESS,
      functionName: 'initPayment',
      args: [message],
      value: parseEther(amount),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      setMessage('');
    }
  }, [isSuccess]);

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
        <div className='w-full max-w-md space-y-4'>
          <input
            type='text'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Amount (ETH)'
            className='
              w-full
              px-6
              py-4
              text-2xl
              font-semibold
              bg-white
              dark:bg-gray-900
              border-2
              border-gray-200
              dark:border-gray-700
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              text-gray-900
              dark:text-white
              placeholder-gray-400
              shadow-lg
              shadow-gray-200/50
              dark:shadow-gray-800/50
            '
          />

          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Message (optional)'
            className='
              w-full
              px-6
              py-4
              bg-white
              dark:bg-gray-900
              border-2
              border-gray-200
              dark:border-gray-700
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              text-gray-900
              dark:text-white
              placeholder-gray-400
              shadow-lg
              shadow-gray-200/50
              dark:shadow-gray-800/50
            '
          />

          {isSuccess && (
            <div className='p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-lg'>
              <p className='text-green-800 dark:text-green-300 text-center font-medium'>
                Payment sent successfully!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='fixed bottom-24 left-0 right-0 flex justify-center z-40 px-4'>
        <button
          onClick={handleSendPayment}
          disabled={isPending || !amount || parseFloat(amount) <= 0}
          className='
    w-full sm:w-auto
    bg-blue-500
    text-white
    px-6
    py-4 sm:py-3
    text-lg sm:text-sm
    rounded-xl
    shadow-lg
    flex
    items-center
    justify-center
    gap-2
    transition-colors
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
  '>
          {isPending ? (
            <>
              <Loader2 size={24} className='animate-spin' />
              <span className='font-semibold'>Sending...</span>
            </>
          ) : (
            <>
              <Send size={24} />
              <span className='font-semibold'>Send Payment</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
