import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;
}
