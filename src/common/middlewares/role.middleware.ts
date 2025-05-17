import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import HttpException from '@/exceptions/http-exception';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== Role.ADMIN) {
    throw new HttpException(403, 'You are not authorized as an admin');
  }
  next();
};
