import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
