import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FindBorrowingsDto } from './dto/find-borrowings.dto';
import { BorrowingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BorrowingsService {
  constructor(private prisma: PrismaService) {
    console.log('BorrowingsService initialized');
  }
  async getAllBorrowings() {
    try {
      return this.prisma.borrowings.findMany({
        include: {
          User: true,
          Book: true,
        },
      });
    } catch (error) {
      console.log('🚀 ~ BorrowingsService ~ getAllBorrowings ~ error', error);
    }
  }

  async getBorrowingById(id: number) {
    try {
      return this.prisma.borrowings.findUnique({
        where: {
          id,
        },
        include: {
          User: true,
          Book: true,
        },
      });
    } catch (error) {
      console.log('🚀 ~ BorrowingsService ~ getBorrowingById ~ error', error);
    }
  }

  async findBorrowingsByUserIdOrBookId(findBorrowingsDto: FindBorrowingsDto) {
    try {
      return this.prisma.borrowings.findMany({
        where: {
          OR: [
            {
              userId: findBorrowingsDto.userId,
            },
            {
              bookId: findBorrowingsDto.bookId,
            },
          ],
        },
        include: {
          User: true,
          Book: true,
        },
      });
    } catch (error) {
      console.log('🚀 ~ BorrowingsService ~ findOne ~ error', error);
    }
  }

  async createBorrowing(borrowingsCreateArgs: Prisma.BorrowingsCreateArgs) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: borrowingsCreateArgs.data.userId,
        },
        include: { Borrowings: true },
      });

      const book = await this.prisma.book.findUnique({
        where: {
          id: borrowingsCreateArgs.data.bookId,
        },
        include: { Borrowings: true },
      });

      const bookBorrowings = await this.prisma.borrowings.findMany({
        where: {
          userId: borrowingsCreateArgs.data.userId,
          status: BorrowingStatus.BORROWED,
        },
      });

      if (book.Borrowings.length >= book.stock) {
        throw new HttpException('Book is out of stock', HttpStatus.BAD_REQUEST);
      }
      if (bookBorrowings.length >= 2) {
        throw new HttpException(
          'User has reached borrowing limit',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.penalty === true) {
        throw new HttpException('User has penalized', HttpStatus.BAD_REQUEST);
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      return this.prisma.borrowings.create({
        data: {
          ...borrowingsCreateArgs.data,
          dueAt: dueDate,
          status: BorrowingStatus.BORROWED,
        },
      });
    } catch (error) {
      console.error('Error in createBorrowing:', error.message, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBorrowing(id: number, data: Prisma.BorrowingsUpdateInput) {
    try {
      return this.prisma.borrowings.update({
        where: {
          id,
        },
        data: data,
      });
    } catch (error) {
      console.log('🚀 ~ BorrowingsService ~ updateBorrowing ~ error', error);
    }
  }

  async returnedBorrowing(id: number) {
    try {
      const borrowing = await this.prisma.borrowings.findUnique({
        where: {
          id: parseInt(id.toString()),
        },
      });
      if (!borrowing) {
        throw new Error('Borrowing not found');
      }
      if (borrowing.status === BorrowingStatus.RETURNED) {
        throw new Error('Borrowing already returned');
      }

      const today = new Date();
      const dueAt = borrowing.dueAt;
      // const diffTime = Math.abs(today.getTime() - dueAt.getTime());
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (today > dueAt) {
        await this.prisma.user.update({
          where: {
            id: borrowing.userId,
          },
          data: {
            penalty: true,
          },
        });
      }

      return this.prisma.borrowings.update({
        where: {
          id: borrowing.id,
        },
        data: {
          status: BorrowingStatus.RETURNED,
        },
      });
    } catch (error) {
      console.log('🚀 ~ BorrowingsService ~ returnedBorrowing ~ error', error);
    }
  }
}
