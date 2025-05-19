import { Request, Response } from 'express';
import { AdminStatsService } from '@/services/admin/stats.service';

const adminService = new AdminStatsService();

export class AdminStatsController {
  async getDashboardStats(req: Request, res: Response) {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({ message: 'Admin stats fetched', data: stats });
  }
}
