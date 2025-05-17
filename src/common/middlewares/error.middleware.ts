import { Request, Response, NextFunction } from 'express';
import HttpException from '@/exceptions/http-exception';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = err instanceof HttpException ? err.status : 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({ success: false, message });
};
