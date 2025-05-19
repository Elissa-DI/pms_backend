import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { RegisterDto } from '@/dtos/auth/register.dto';
import { LoginDto } from '@/dtos/auth/login.dto';
import { sendOtpToEmail } from '@/common/utils/send-otp';
import { VerifyEmailDto } from '@/dtos/auth/verify-email.dto';
import sendEmail from '@/common/utils/email';

const prisma = new PrismaClient();

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const secret = speakeasy.generateSecret({ length: 20 });

    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        isVerified: false,
        otp,
      }
    });

    await sendOtpToEmail(user.email, otp);

    return {
      message: "User registered successfully. Please verify your email.",
      user: { id: user.id, email: user.email }
    };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { email, otp } = dto;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    if (user.isVerified) {
      return { message: 'User is already verified' };
    }

    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendOtp(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    if (user.isVerified) {
      throw new Error('User is already verified');
    }

    const secret = speakeasy.generateSecret({ length: 20 });

    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    await prisma.user.update({
      where: { email },
      data: { otp },
    });

    await sendEmail(email, 'Your new OTP code', `Your new OTP code is: ${otp}`);

    return { message: 'OTP resent successfully. Please check your email.' };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = speakeasy.generateSecret({ length: 32 }).base32;
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendEmail(
      email,
      'Password Reset Request',
      `Use this token to reset your password: ${resetToken}`
    );

    return { message: 'Reset token sent to email' };
  }


  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) throw new Error('Invalid or expired reset token');

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }

}
