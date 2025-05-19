import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminStatsService {
    async getDashboardStats() {
        const [totalUsers, verifiedUsers, totalBookings, pendingBookings, confirmedBookings, availableSlots, occupiedSlots, unavailableSlots] =
            await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { isVerified: true } }),
                prisma.booking.count(),
                prisma.booking.count({ where: { status: 'PENDING' } }),
                prisma.booking.count({ where: { status: 'CONFIRMED' } }),
                prisma.slot.count({ where: { status: 'AVAILABLE' } }),
                prisma.slot.count({ where: { status: 'OCCUPIED' } }),
                prisma.slot.count({ where: { status: 'UNAVAILABLE' } }),
            ]);

        return {
            totalUsers,
            verifiedUsers,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            availableSlots,
            occupiedSlots,
            unavailableSlots,
        };
    }
}
