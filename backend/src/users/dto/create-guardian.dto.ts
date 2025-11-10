import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGuardianDto {
  @IsString()
  @IsNotEmpty()
  guardianWallet: string;
}
