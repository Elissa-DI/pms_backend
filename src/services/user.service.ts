import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        role: true,
        createdAt: true,
      },
    });
  }


  async getMyProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

}
