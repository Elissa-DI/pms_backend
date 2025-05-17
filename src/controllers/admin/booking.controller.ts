import { Request, Response, NextFunction } from 'express';
import { BookingService } from '@/services/admin/booking.service';
import { CreateBookingDto } from '@/dtos/booking/admin/create-booking.dto';
import { BookingStatus } from '@/common/enums/status.enum';
import { UpdateBookingDto } from '@/dtos/booking/admin/update-booking.dto';

const service = new BookingService();

export class BookingController {
  async create(req: Request, res: Response, next: NextFunction) {
    const data: CreateBookingDto = req.body;
    const booking = await service.createBooking(data);
    res.status(201).json({ message: 'Booking created', booking });
  }

  async list(req: Request, res: Response, next: NextFunction) {
    const bookings = await service.getAllBookings();
    res.json({ message: 'Bookings retrieved successfully', bookings });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const booking = await service.getBookingById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data: UpdateBookingDto = req.body;
    const updated = await service.updateBooking(id, data);
    res.json({ message: 'Booking updated', updated });
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await service.updateBookingStatus(id, status as BookingStatus);
    res.json({ message: 'Booking status updated', updated });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await service.deleteBooking(id);
    res.status(200).json(result);
  }

}
