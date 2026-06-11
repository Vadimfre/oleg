import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRouteAdminDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description!: string;

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: 'easy' | 'medium' | 'hard';

  @Transform(({ value }) => parseFloat(String(value)))
  @IsNumber()
  distance!: number;

  @Transform(({ value }) => parseFloat(String(value)))
  @IsNumber()
  duration!: number;

  @Transform(({ value }) => parseInt(String(value), 10))
  @IsInt()
  elevation!: number;

  /** Каждая строка — отдельный пункт «достопримечательности» */
  @IsString()
  @IsNotEmpty()
  highlights!: string;

  /** JSON: [[lat, lng], ...] — минимум 2 точки */
  @IsString()
  @IsNotEmpty()
  coordinates!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
