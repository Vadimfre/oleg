import { IsOptional, IsString } from 'class-validator';

export class StartRideDto {
  @IsOptional()
  @IsString()
  routeSlug?: string;

  @IsString()
  routeTitle: string;
}
