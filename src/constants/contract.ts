export const blipAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'fallback',
    stateMutability: 'payable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'acceptGuardianRole',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approvePayment',
    inputs: [
      {
        name: '_paymentId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelGuardianProposal',
    inputs: [
      {
        name: 'newGuardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelPendingPayment',
    inputs: [
      {
        name: '_paymentId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'declineGuardianRole',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPayment',
    inputs: [
      {
        name: '_id',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'message',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'status',
        type: 'uint8',
        internalType: 'enum Blip.PaymentStatus',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasApproved',
    inputs: [
      {
        name: '_paymentId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initPayment',
    inputs: [
      {
        name: '_recipient',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_message',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'initPayment',
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_recipient',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_message',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isGuardian',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'leaveGuardianRole',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'paymentCounter',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'payments',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'guardianCount',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'approvalCount',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'status',
        type: 'uint8',
        internalType: 'enum Blip.PaymentStatus',
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'message',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingGuardians',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proposeGuardian',
    inputs: [
      {
        name: 'newGuardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rejectPayment',
    inputs: [
      {
        name: '_paymentId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeGuardian',
    inputs: [
      {
        name: 'oldGuardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'userGuardians',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GuardianAdded',
    inputs: [
      {
        name: 'recipientAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardianAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianDeclinedRole',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianLeftRole',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianProposalCancelled',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianProposed',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'proposedGuardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianRemoved',
    inputs: [
      {
        name: 'recipientAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'guardianAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PaymentInitiated',
    inputs: [
      {
        name: 'paymentId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'senderAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'tokenAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'message',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PaymentRefunded',
    inputs: [
      {
        name: 'paymentId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'senderAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PaymentRejected',
    inputs: [
      {
        name: 'paymentId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'signerAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PaymentReleased',
    inputs: [
      {
        name: 'paymentId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'recipientAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PaymentSigned',
    inputs: [
      {
        name: 'paymentId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'signerAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'DirectPaymentsNotAllowed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianAlreadyExist',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianAlreadyPending',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianDoesNotExist',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianLimitReached',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianNotPending',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientContractBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAmount',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoGuardiansSet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotASigner',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotRecipient',
    inputs: [],
  },
  {
    type: 'error',
    name: 'PaymentNotApproved',
    inputs: [],
  },
  {
    type: 'error',
    name: 'PaymentNotPending',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RecipientCannotBeGuardian',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'SignerAlreadyApproved',
    inputs: [],
  },
] as const;
