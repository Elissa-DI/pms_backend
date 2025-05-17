import { PrismaClient } from '@prisma/client';
import { CreateBookingDto } from '@/dtos/booking/admin/create-booking.dto';
import { BookingStatus, SlotStatus } from '@/common/enums/status.enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import HttpException from '@/exceptions/http-exception';
import { UpdateBookingDto } from '@/dtos/booking/admin/update-booking.dto';

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(data: CreateBookingDto) {
    try {
      // 1. Check if the slot exists
      const slot = await prisma.slot.findUnique({
        where: { id: data.slotId },
      });

      if (!slot) {
        throw new HttpException(404, 'Slot not found');
      }

      // 2. Check if slot is AVAILABLE
      if (slot.status !== SlotStatus.AVAILABLE) {
        throw new HttpException(400, 'Slot is not available for booking');
      }

      // 4. Check if the slot has already been booked (by anyone)
      const existingBooking = await prisma.booking.findFirst({
        where: {
          slotId: data.slotId,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
      });

      if (existingBooking) {
        throw new HttpException(400, 'Slot has already been booked');
      }

      // 5. Check if the user has already booked this slot before
      const userDuplicate = await prisma.booking.findFirst({
        where: {
          userId: data.userId,
          slotId: data.slotId,
        },
      });

      if (userDuplicate) {
        throw new HttpException(400, 'You have already booked this slot');
      }

      // 6. All checks passed, proceed to create the booking
      return await prisma.booking.create({
        data: {
          userId: data.userId,
          slotId: data.slotId,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status ?? BookingStatus.PENDING,
        },
      });

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new HttpException(400, 'Invalid userId or slotId');
      }

      throw error;
    }
  }

  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        user: true,
        slot: true,
      },
    });
  }

  async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        slot: true,
      },
    });
  }

  async updateBooking(id: string, data: UpdateBookingDto) {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) throw new HttpException(404, 'Booking not found');

    return prisma.booking.update({
      where: { id },
      data,
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new HttpException(404, 'Booking not found');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    if (status === BookingStatus.CONFIRMED) {
      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { status: SlotStatus.OCCUPIED },
      });
    }

    if (status === BookingStatus.CANCELLED) {
      const otherConfirmed = await prisma.booking.findFirst({
        where: {
          slotId: booking.slotId,
          status: BookingStatus.CONFIRMED,
          NOT: { id },
        },
      });

      if (!otherConfirmed) {
        await prisma.slot.update({
          where: { id: booking.slotId },
          data: { status: SlotStatus.AVAILABLE },
        });
      }
    }

    return updated;
  }

  async deleteBooking(id: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new HttpException(404, 'Booking not found');
    }

    await prisma.booking.delete({ where: { id } });

    const otherConfirmed = await prisma.booking.findFirst({
      where: {
        slotId: booking.slotId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (!otherConfirmed) {
      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { status: SlotStatus.AVAILABLE },
      });
    }

    return { message: 'Booking deleted and slot status updated if necessary' };
  }
}
