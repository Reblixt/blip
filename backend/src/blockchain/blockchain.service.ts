import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { blipAbi } from 'constants/contract';
import { PrismaService } from 'src/prisma/prisma.service';
import { VIEM_PROVIDER, ViemProvider } from 'src/provider/provider.viem';
import { UsersService } from 'src/users/users.service';
import { PaymentsService } from 'src/payments/payments.service';
import { Address } from 'viem';

@Injectable()
export class BlockchainService implements OnModuleInit {
  constructor(
    @Inject(VIEM_PROVIDER) private readonly viem: ViemProvider,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService
  ) {}
  private readonly logger = new Logger(BlockchainService.name);

  async onModuleInit() {
    this.watchGuardianEvents();
    this.watchPaymentEvents();
  }

  async watchGuardianEvents() {
    this.logger.debug('Starting to watch Guardian events...');

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianProposed',
      onLogs: async (log) => {
        const recipient = log[0].args.recipient;
        const guardian = log[0].args.proposedGuardian;

        this.logger.debug(
          `GuardianProposed event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.usersService.upsertUser(recipient);
        await this.usersService.upsertUser(guardian);
        await this.usersService.proposeGuardianByWallet(recipient, guardian);
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianProposed events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianAdded',
      onLogs: async (log) => {
        const recipient = log[0].args.recipientAddress;
        const guardian = log[0].args.guardianAddress;

        this.logger.debug(
          `GuardianAdded event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );

        await this.usersService.acceptGuardianRoleByWallets(
          recipient,
          guardian
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianAdded events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianDeclinedRole',
      onLogs: async (log) => {
        const recipient = log[0].args.recipient;
        const guardian = log[0].args.guardian;

        this.logger.debug(
          `GuardianDeclinedRole event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );

        await this.usersService.removeGuardianRelationByWallets(
          recipient,
          guardian
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianDeclinedRole events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianProposalCancelled',
      onLogs: async (log) => {
        const recipient = log[0].args.recipient;
        const guardian = log[0].args.guardian;

        this.logger.debug(
          `GuardianProposalCancelled event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.usersService.removeGuardianRelationByWallets(
          recipient,
          guardian
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianProposalCancelled events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianLeftRole',
      onLogs: async (log) => {
        const recipient = log[0].args.recipient;
        const guardian = log[0].args.guardian;

        this.logger.debug(
          `GuardianLeftRole event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.usersService.removeGuardianRelationByWallets(
          recipient,
          guardian
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianLeftRole events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'GuardianRemoved',
      onLogs: async (log) => {
        const recipient = log[0].args.recipientAddress;
        const guardian = log[0].args.guardianAddress;

        this.logger.debug(
          `GuardianRemoved event detected: Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Guardian - ${JSON.stringify(
            guardian,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.usersService.removeGuardianRelationByWallets(
          recipient,
          guardian
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching GuardianRemoved events: ${error.message}`
        );
      },
    });
  }

  async watchPaymentEvents() {
    this.logger.debug('Starting to watch Payment events...');

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'PaymentInitiated',
      onLogs: async (log) => {
        const paymentId = log[0].args.paymentId;
        const sender = log[0].args.senderAddress;
        const recipient = log[0].args.recipient;
        const amount = log[0].args.amount;
        const tokenAddress = log[0].args.tokenAddress;
        const message = log[0].args.message;

        this.logger.debug(
          `PaymentInitiated event detected: paymentId - ${JSON.stringify(
            paymentId,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},Sender - ${JSON.stringify(
            sender,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Amount - ${JSON.stringify(
            amount,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},
          )}, Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},
          )}, Message - ${JSON.stringify(
            message,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},
          )}, TokenAddress - ${JSON.stringify(
            tokenAddress,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},`
        );
        await this.usersService.upsertUser(sender);
        await this.usersService.upsertUser(recipient);
        await this.paymentsService.create(
          {
            recipientWallet: recipient,
            amount: amount.toString(),
            tokenAddress: tokenAddress,
            message: message,
          },
          sender,
          Number(paymentId)
        );
        this;
      },

      onError: (error) => {
        this.logger.error(
          `Error watching PaymentInitiated events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'PaymentSigned',
      onLogs: async (log) => {
        const paymentId = log[0].args.paymentId;
        const signer = log[0].args.signerAddress;
        const amount = log[0].args.amount;

        this.logger.debug(
          `PaymentSigned event detected: PaymentId - ${JSON.stringify(
            paymentId,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},Signer - ${JSON.stringify(
            signer,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Amount - ${JSON.stringify(
            amount,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.paymentsService.approveByContractId(
          Number(paymentId),
          signer
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching PaymentSigned events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'PaymentReleased',
      onLogs: async (log) => {
        const paymentId = log[0].args.paymentId;
        const recipient = log[0].args.recipientAddress;
        const amount = log[0].args.amount;

        this.logger.debug(
          `PaymentReleased event detected: paymentId - ${JSON.stringify(
            paymentId,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Recipient - ${JSON.stringify(
            recipient,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Amount - ${JSON.stringify(
            amount,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.paymentsService.releasePayment(Number(paymentId));
      },

      onError: (error) => {
        this.logger.error(
          `Error watching PaymentReleased events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'PaymentRejected',
      onLogs: async (log) => {
        const paymentId = log[0].args.paymentId;
        const signer = log[0].args.signerAddress;
        const amount = log[0].args.amount;

        this.logger.debug(
          `PaymentRejected event detected: paymentId - ${JSON.stringify(
            paymentId,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )},Signer - ${JSON.stringify(
            signer,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Amount - ${JSON.stringify(
            amount,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
        await this.paymentsService.rejectByContractId(Number(paymentId));
      },

      onError: (error) => {
        this.logger.error(
          `Error watching PaymentRejected events: ${error.message}`
        );
      },
    });

    this.viem.watchContractEvent({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
      eventName: 'PaymentRefunded',

      onLogs: (log) => {
        const sender = log[0].args.senderAddress;
        const amount = log[0].args.amount;

        this.logger.debug(
          `PaymentRefunded event detected: Sender - ${JSON.stringify(
            sender,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}, Amount - ${JSON.stringify(
            amount,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )}`
        );
      },

      onError: (error) => {
        this.logger.error(
          `Error watching PaymentRefunded events: ${error.message}`
        );
      },
    });
  }
}
