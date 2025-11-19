import { IsString, IsOptional, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  recipientWallet: string;
  @IsString()
  @IsNotEmpty()
  amount: string;
  @IsString()
  @IsOptional()
  tokenAddress?: string;
  @IsString()
  @IsOptional()
  message?: string;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
