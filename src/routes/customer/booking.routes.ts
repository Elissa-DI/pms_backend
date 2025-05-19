import { Router, Request, Response, NextFunction } from 'express';
import { CustomerBookingController } from '@/controllers/customer/booking.controller';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { IRouter } from '@/common/interfaces/route.interface';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

class CustomerBookingRouter implements IRouter {
  public path = '/api/customer/bookings';
  public router = Router();
  private controller = new CustomerBookingController();

  constructor() {
    this.initializeRoutes();
  }

  private asyncHandler = <
    Req extends Request = Request,
    Res extends Response = Response
  >(
    fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
  ): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req, res, next) => {
      Promise.resolve(fn(req as Req, res as Res, next)).catch(next);
    };
  };


  private initializeRoutes(): void {
    this.router.get(
      '/me',
      isAuthenticated,
      this.asyncHandler<RequestWithUser>(this.controller.getMyBookings.bind(this.controller))
    );

    this.router.post(
      '/',
      isAuthenticated,
      this.asyncHandler<RequestWithUser>(this.controller.bookSlot.bind(this.controller))
    );

    this.router.get(
      '/:id',
      isAuthenticated,
      this.asyncHandler<RequestWithUser>(this.controller.getBookingById.bind(this.controller))
    );

    this.router.patch(
      '/:id/cancel',
      isAuthenticated,
      this.asyncHandler<RequestWithUser>(this.controller.cancelBooking.bind(this.controller))
    );

    this.router.get(
      '/:id/ticket',
      isAuthenticated,
      this.asyncHandler<RequestWithUser>(this.controller.getPaymentTicket.bind(this.controller))
    );
  }
}

export default CustomerBookingRouter;
