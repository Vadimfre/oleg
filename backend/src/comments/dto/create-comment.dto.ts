import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  @MinLength(1, { message: 'Комментарий не может быть пустым' })
  @MaxLength(1000, { message: 'Комментарий не должен превышать 1000 символов' })
  text: string;
}
