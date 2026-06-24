import { IsString, IsOptional, MinLength, IsEmail, IsNumber, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(500)
  monthlyGoalKm?: number;
}
