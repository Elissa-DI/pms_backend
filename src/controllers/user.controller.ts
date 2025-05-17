import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';

const service = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await service.getAllUsers();
    res.json({ message: 'Users retrieved successfully', users });
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
  const user = await service.getMyProfile((req as any).user.id);
  res.json({ message: 'User profile retrieved successfully', user });
}

}
