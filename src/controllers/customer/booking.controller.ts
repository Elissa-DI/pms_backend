import { Request, Response, NextFunction } from 'express';
import { CustomerBookingService } from '@/services/customer/booking.service';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

const service = new CustomerBookingService();

export class CustomerBookingController {
    async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
        const { size, vehicleType } = req.query;
        const slots = await service.getAvailableSlots({
            size: size as string,
            vehicleType: vehicleType as string,
        });
        res.status(200).json(slots);
    }


    async bookSlot(req: RequestWithUser, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const { slotId, startTime, endTime } = req.body;
        const booking = await service.bookSlot({
            slotId,
            userId: req.user.id,
            startTime,
            endTime,
        });
        res.status(201).json({ message: 'Booking created', booking });
    }

    async getMyBookings(req: RequestWithUser, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const bookings = await service.getMyBookings(userId);
        res.status(200).json(bookings);
    }

    async getBookingById(req: RequestWithUser, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const { id } = req.params;
        const booking = await service.getBookingById(id, userId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    }

    async cancelBooking(req: RequestWithUser, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const { id } = req.params;
        await service.cancelBooking(id, userId);
        res.status(200).json({ message: 'Booking cancelled' });
    }

    async getPaymentTicket(req: RequestWithUser, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const { id: bookingId } = req.params;

        const ticket = await service.generatePaymentTicket(bookingId, userId);
        res.status(200).json(ticket);
    }
}
