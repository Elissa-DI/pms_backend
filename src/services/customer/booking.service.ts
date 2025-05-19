import { PrismaClient } from "@prisma/client";
import { BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerBookingService {
    async getAvailableSlots(filters: { size?: string; vehicleType?: string }) {
        // return prisma.slot.findMany({ where: { status: 'AVAILABLE' } });
        return prisma.slot.findMany({
            where: {
                status: 'AVAILABLE',
                ...(filters.size && { size: filters.size as any }),
                ...(filters.vehicleType && { vehicleType: filters.vehicleType as any }),
            },
        });
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


    // async generatePaymentTicket(bookingId: string, userId: string) {
    //     const booking = await prisma.booking.findFirst({
    //         where: { id: bookingId, userId },
    //         include: { slot: true },
    //     });

    //     if (!booking) throw new Error('Booking not found');

    //     const { startTime, endTime } = booking;

    //     if (!startTime || !endTime) {
    //         throw new Error('Booking does not have valid time range');
    //     }

    //     const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
    //     const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    //     const ratePerHour = 1000; // Customize as needed
    //     const total = durationHours * ratePerHour;

    //     return {
    //         bookingId: booking.id,
    //         slotNumber: booking.slot.number,
    //         vehicleType: booking.slot.vehicleType,
    //         location: booking.slot.location,
    //         startTime,
    //         endTime,
    //         durationHours,
    //         ratePerHour,
    //         total,
    //     };
    // }

    async generatePaymentTicket(bookingId: string, userId: string) {
        const booking = await prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: { slot: true },
        });

        if (!booking) throw new Error('Booking not found');

        const { startTime, endTime, slot } = booking;

        // Calculate exact duration in hours (as a float)
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60); // convert ms to hours

        // Define rate based on vehicle type
        const rates: Record<string, number> = {
            CAR: 1000,
            MOTORCYCLE: 500,
            TRUCK: 1500,
        };

        const rate = rates[slot.vehicleType] || 1000;
        const total = parseFloat((durationHours * rate).toFixed(2));

        return {
            bookingId: booking.id,
            slotNumber: slot.number,
            vehicleType: slot.vehicleType,
            location: slot.location,
            startTime,
            endTime,
            durationHours: parseFloat(durationHours.toFixed(2)),
            ratePerHour: rate,
            total,
        };
    }

}
