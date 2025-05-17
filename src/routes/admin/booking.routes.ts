import { Router, Request, Response, NextFunction } from 'express';
import { BookingController } from '@/controllers/admin/booking.controller';
import validationMiddleware from '@/common/middlewares/validation.middleware';
import { CreateBookingDto } from '@/dtos/booking/admin/create-booking.dto';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { isAdmin } from '@/common/middlewares/role.middleware';
import { IRouter } from '@/common/interfaces/route.interface';
import { UpdateBookingDto } from '@/dtos/booking/admin/update-booking.dto';
import { UpdateBookingStatusDto } from '@/dtos/booking/admin/update-booking-status.dto';

class BookingRouter implements IRouter {
  public path = '/api/bookings';
  public router = Router();
  private controller = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  private initializeRoutes(): void {
    // Apply authentication and role-based access control for all booking routes
    this.router.use(isAuthenticated, isAdmin);

    // Create a new booking
    this.router.post(
      '/',
      validationMiddleware(CreateBookingDto),
      this.asyncHandler(this.controller.create.bind(this.controller))
    );

    // List all bookings
    this.router.get(
      '/',
      this.asyncHandler(this.controller.list.bind(this.controller))
    );

    //List a single booking by ID
    this.router.get(
      '/:id',
      this.asyncHandler(this.controller.getOne.bind(this.controller))
    );

    // Update booking status (e.g., APPROVED, REJECTED, etc.)
    this.router.patch(
      '/:id',
      validationMiddleware(UpdateBookingDto),
      this.asyncHandler(this.controller.update.bind(this.controller))
    );

    // PATCH /api/bookings/:id/status
    this.router.patch(
      '/:id/status',
      isAdmin,
      validationMiddleware(UpdateBookingStatusDto),
      this.asyncHandler(this.controller.updateStatus.bind(this.controller))
    );

    // Delete a booking
    this.router.delete(
      '/:id',
      this.asyncHandler(this.controller.delete.bind(this.controller))
    );
  }
}

export default BookingRouter;
