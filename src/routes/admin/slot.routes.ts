import { Router, Request, Response, NextFunction } from 'express';
import { SlotController } from '@/controllers/admin/slot.controller';
import validationMiddleware from '@/common/middlewares/validation.middleware';
import { CreateSlotDto } from '@/dtos/slot/create-slot.dto';
import { UpdateSlotDto } from '@/dtos/slot/update-slot.dto';
import { IRouter } from '@/common/interfaces/route.interface';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { isAdmin } from '@/common/middlewares/role.middleware';

class SlotRouter implements IRouter {
  public path = '/api/slots';
  public router = Router();
  private controller = new SlotController();

  constructor() {
    this.initializeRoutes();
  }

  private asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  private initializeRoutes(): void {
    this.router.post(
      '/',
      isAuthenticated,
      isAdmin, 
      validationMiddleware(CreateSlotDto),
      this.asyncHandler(this.controller.createSlot.bind(this.controller))
    );

    this.router.get(
      '/',
      isAuthenticated,
      this.asyncHandler(this.controller.getAllSlots.bind(this.controller))
    );

    this.router.get(
      '/:id',
      isAuthenticated,
      this.asyncHandler(this.controller.getSlotById.bind(this.controller))
    );

    this.router.patch(
      '/:id',
      isAuthenticated,
      isAdmin,
      validationMiddleware(UpdateSlotDto, 'body', true),
      this.asyncHandler(this.controller.updateSlot.bind(this.controller))
    );

    this.router.delete(
      '/:id',
      isAuthenticated,
      isAdmin,
      this.asyncHandler(this.controller.deleteSlot.bind(this.controller))
    );
  }
}

export default SlotRouter;
