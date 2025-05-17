import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import validationMiddleware from '@/common/middlewares/validation.middleware';
import { RegisterDto } from '@/dtos/auth/register.dto';
import { LoginDto } from '@/dtos/auth/login.dto';
import { VerifyEmailDto } from '@/dtos/auth/verify-email.dto';
import { ResendOtpDto } from '@/dtos/auth/resend-otp.dto';
import { IRouter } from '@/common/interfaces/route.interface';

class AuthRouter implements IRouter {
  public path = '/api/auth';
  public router = Router();
  private controller = new AuthController();

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
      '/register',
      validationMiddleware(RegisterDto),
      this.asyncHandler(this.controller.register.bind(this.controller))
    );
    this.router.post(
      '/login',
      validationMiddleware(LoginDto),
      this.asyncHandler(this.controller.login.bind(this.controller))
    );
    this.router.post(
      '/verify-email',
      validationMiddleware(VerifyEmailDto),
      this.asyncHandler(this.controller.verifyEmail.bind(this.controller))
    );
    this.router.post(
      '/resend-otp',
      validationMiddleware(ResendOtpDto),
      this.asyncHandler(this.controller.resendOtp.bind(this.controller))
    );
  }
}

export default AuthRouter;
