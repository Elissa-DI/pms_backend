import { PrismaClient, Slot, SlotSize, VehicleType, SlotStatus } from '@prisma/client';
import { CreateSlotDto } from '@/dtos/slot/create-slot.dto';
import { UpdateSlotDto } from '@/dtos/slot/update-slot.dto';
import HttpException from '@/exceptions/http-exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export class SlotService {
    async createSlot(data: CreateSlotDto): Promise<Slot> {
        try {
            return await prisma.slot.create({ data });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                Array.isArray(error.meta?.target) && error.meta.target.includes('number')
            ) {
                throw new HttpException(409, 'Slot number already exists');
            }
            throw error;
        }
    }

    async getAllSlots(): Promise<Slot[]> {
        return prisma.slot.findMany();
    }

    async getSlotById(id: string): Promise<Slot | null> {
        return prisma.slot.findUnique({ where: { id } });
    }

    async updateSlot(id: string, data: UpdateSlotDto): Promise<Slot> {
        return prisma.slot.update({
            where: { id },
            data,
        });
    }

    async deleteSlot(id: string): Promise<Slot> {
        const slot = await prisma.slot.findUnique({ where: { id } });

        if (!slot) {
            throw new HttpException(404, 'Slot not found');
        }

        return prisma.slot.delete({ where: { id } });
    }
}
