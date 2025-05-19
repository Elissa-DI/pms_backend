import { Request, Response, NextFunction } from 'express';
import { SlotService } from '@/services/admin/slot.service';
import { CreateSlotDto } from '@/dtos/slot/create-slot.dto';
import { UpdateSlotDto } from '@/dtos/slot/update-slot.dto';

export class SlotController {
    private service = new SlotService();

    async createSlot(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateSlotDto;
            const slot = await this.service.createSlot(data);
            res.status(201).json({
                message: 'Slot created successfully',
                slot,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllSlots(req: Request, res: Response, next: NextFunction) {
        try {
            const slots = await this.service.getAllSlots();
            res.json({
                message: 'Slots retrieved successfully',
                slots,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSlotById(req: Request, res: Response, next: NextFunction) {
        try {
            const slot = await this.service.getSlotById(req.params.id);
            if (!slot) return res.status(404).json({ message: 'Slot not found' });

            res.json({
                message: 'Slot retrieved successfully',
                slot,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSlot(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as UpdateSlotDto;
            const slot = await this.service.updateSlot(req.params.id, data);
            res.json({
                message: 'Slot updated successfully',
                slot,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteSlot(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedSlot = await this.service.deleteSlot(req.params.id);
            res.json({
                message: 'Slot deleted successfully',
                slot: deletedSlot,
            });
        } catch (error) {
            next(error);
        }
    }
}
