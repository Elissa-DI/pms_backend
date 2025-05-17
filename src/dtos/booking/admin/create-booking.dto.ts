import { IsUUID, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from '@/common/enums/status.enum';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  public userId!: string;

  @IsUUID()
  @IsNotEmpty()
  public slotId!: string;

  @IsDateString()
  @IsNotEmpty()
  public startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  public endTime!: string;

  @IsEnum(BookingStatus)
  public status?: BookingStatus;
}
