import { Router, Request, Response, NextFunction } from 'express';
import { AdminStatsController } from '@/controllers/admin/stats.controller';
import { IRouter } from '@/common/interfaces/route.interface';
import { isAuthenticated } from '@/common/middlewares/auth.middleware';
import { isAdmin } from '@/common/middlewares/role.middleware';

class AdminRouter implements IRouter {
    public path = '/api';
    public router = Router();
    private controller = new AdminStatsController();

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
            '/stats',
            isAuthenticated,
            isAdmin,
            this.asyncHandler(this.controller.getDashboardStats.bind(this.controller))
        );
    }
}

export default AdminRouter;
