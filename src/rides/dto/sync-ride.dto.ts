import { IsArray, IsNumber, IsOptional, Min } from 'class-validator';

export class SyncRideDto {
  @IsNumber()
  @Min(0)
  elapsedSec: number;

  @IsNumber()
  @Min(0)
  movingSec: number;

  @IsNumber()
  @Min(0)
  distanceKm: number;

  @IsOptional()
  @IsNumber()
  avgSpeedKmh?: number;

  @IsOptional()
  @IsNumber()
  maxSpeedKmh?: number;

  @IsOptional()
  @IsNumber()
  avgPaceMinPerKm?: number;

  @IsOptional()
  @IsNumber()
  maxOffRouteKm?: number;

  @IsOptional()
  @IsNumber()
  routeCompletion?: number;

  @IsArray()
  trackPoints: { lat: number; lng: number; t: number; speed?: number | null }[];
}
