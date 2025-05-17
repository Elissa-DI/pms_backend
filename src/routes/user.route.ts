import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '@/controllers/user.controller';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { isAdmin } from '@/common/middlewares/role.middleware';
import { IRouter } from '@/common/interfaces/route.interface';

class UserRouter implements IRouter {
  public path = '/api/users';
  public router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  private initializeRoutes(): void {
    // Get all users - admin only
    this.router.get(
      '/',
      isAuthenticated,
      isAdmin,
      this.asyncHandler(this.controller.getAllUsers.bind(this.controller))
    );


    this.router.get(
      '/me',
      isAuthenticated,
      this.asyncHandler(this.controller.getMyProfile.bind(this.controller))
    );
  }
}

export default UserRouter;
