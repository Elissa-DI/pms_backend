import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SlotSize, VehicleType, SlotStatus } from '@prisma/client';

export class CreateSlotDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsEnum(SlotSize)
  size!: SlotSize;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsEnum(SlotStatus)
  status?: SlotStatus; // Optional because it has default
}
