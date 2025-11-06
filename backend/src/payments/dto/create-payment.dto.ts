import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  recipientId: string;
  @IsString()
  @IsNotEmpty()
  amount: string;
  @IsString()
  @IsOptional()
  tokenAddress?: string;
  @IsString()
  @IsOptional()
  message?: string;
}
