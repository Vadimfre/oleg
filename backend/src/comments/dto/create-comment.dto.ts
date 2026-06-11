import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Комментарий не может быть пустым' })
  text: string;
}
