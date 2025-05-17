// src/routes/customer/slot.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { CustomerBookingController } from '@/controllers/customer/booking.controller';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { IRouter } from '@/common/interfaces/route.interface';

class CustomerSlotRouter implements IRouter {
  public path = '/api/customer/slots';
  public router = Router();
  private controller = new CustomerBookingController();

  constructor() {
    this.initializeRoutes();
  }

  private asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  private initializeRoutes(): void {
    this.router.get(
      '/',
      isAuthenticated,
      this.asyncHandler(this.controller.getAvailableSlots.bind(this.controller))
    );
  }
}

export default CustomerSlotRouter;
