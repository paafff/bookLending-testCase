import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
    console.log('UserService initialized');
  }

  async getAllUsers() {
    try {
      return this.prisma.user.findMany({
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ getAllUsers ~ error', error);
    }
  }

  async getUserByCode(code: string) {
    try {
      return this.prisma.user.findUnique({
        where: {
          code,
        },
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ getUserByCode ~ error', error);
    }
  }

  async getUserById(id: string) {
    try {
      return this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ getUserById ~ error', error);
    }
  }
}
