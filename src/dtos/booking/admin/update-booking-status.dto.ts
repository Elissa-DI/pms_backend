import { IsEnum } from 'class-validator';
import { BookingStatus } from '@/common/enums/status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, {
    message: `Status must be one of: ${Object.values(BookingStatus).join(', ')}`,
  })
  status?: BookingStatus;
}
