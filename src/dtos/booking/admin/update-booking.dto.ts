import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { BookingStatus } from '@/common/enums/status.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  slotId?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
