import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/[a-z]/, {
    message: 'Пароль должен содержать хотя бы одну строчную букву',
  })
  @Matches(/[A-Z]/, {
    message: 'Пароль должен содержать хотя бы одну заглавную букву',
  })
  @Matches(/\d/, {
    message: 'Пароль должен содержать хотя бы одну цифру',
  })
  @Matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
    message: 'Пароль должен содержать хотя бы один специальный символ',
  })
  @Matches(/^(?!.*(.)\1\1)/, {
    message: 'Пароль не должен содержать три одинаковых символа подряд',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  name: string;
}
