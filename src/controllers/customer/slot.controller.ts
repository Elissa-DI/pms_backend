import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerSlotController {
  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    const availableSlots = await prisma.slot.findMany({
      where: { status: 'AVAILABLE' },
    });
    res.json({ data: availableSlots });
  }
}
