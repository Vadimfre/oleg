import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
