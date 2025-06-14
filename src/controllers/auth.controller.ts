import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { RegisterDto } from '@/dtos/auth/register.dto';
import { LoginDto } from '@/dtos/auth/login.dto';
import { VerifyEmailDto } from '@/dtos/auth/verify-email.dto';
import { ResendOtpDto } from '@/dtos/auth/resend-otp.dto';
import { ForgotPasswordDto } from '@/dtos/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/dtos/auth/reset-password.dto';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const dto: RegisterDto = req.body;
    const result = await authService.register(dto);
    return res.status(201).json(result);
  }


  async login(req: Request, res: Response) {
    const dto: LoginDto = req.body;
    const result = await authService.login(dto);
    return res.status(200).json(result);
  }


  async verifyEmail(req: Request, res: Response) {
    const dto: VerifyEmailDto = req.body;
    const result = await authService.verifyEmail(dto);
    return res.status(200).json(result);
  }


  async resendOtp(req: Request, res: Response) {
    const dto: ResendOtpDto = req.body;
    const result = await authService.resendOtp(dto.email);
    return res.status(200).json(result);
  }


  async forgotPassword(req: Request, res: Response) {
    const dto: ForgotPasswordDto = req.body;
    const result = await authService.forgotPassword(dto.email);
    return res.status(200).json(result);
  }


  async resetPassword(req: Request, res: Response) {
    const dto: ResetPasswordDto = req.body;
    const result = await authService.resetPassword(dto.token, dto.newPassword);
    return res.status(200).json(result);
  }
}
