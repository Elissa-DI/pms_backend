import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SlotSize, VehicleType, SlotStatus } from '@prisma/client';

export class UpdateSlotDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsEnum(SlotSize)
  @IsOptional()
  size?: SlotSize;

  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus;
}
