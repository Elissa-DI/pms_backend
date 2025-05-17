import { PrismaClient } from "@prisma/client";
import { BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerBookingService {
    async getAvailableSlots() {
        return prisma.slot.findMany({ where: { status: 'AVAILABLE' } });
    }

    async bookSlot(data: {
        slotId: string;
        userId: string;
        startTime: Date;
        endTime: Date;
    }) {
        return prisma.booking.create({
            data: {
                slotId: data.slotId,
                userId: data.userId,
                startTime: data.startTime,
                endTime: data.endTime,
                status: BookingStatus.PENDING,
            },
        });
    }


    async getMyBookings(userId: string) {
        return prisma.booking.findMany({
            where: { userId },
            include: { slot: true },
        });
    }

    async getBookingById(id: string, userId: string) {
        return prisma.booking.findFirst({
            where: { id, userId },
            include: { slot: true },
        });
    }

    async cancelBooking(id: string, userId: string) {
        const booking = await prisma.booking.updateMany({
            where: { id, userId },
            data: { status: BookingStatus.CANCELLED },
        });

        // Optionally update slot to AVAILABLE if this was the only active booking
        const updatedBooking = await prisma.booking.findUnique({ where: { id } });
        if (updatedBooking?.slotId) {
            await prisma.slot.update({
                where: { id: updatedBooking.slotId },
                data: { status: 'AVAILABLE' },
            });
        }

        return booking;
    }
}
