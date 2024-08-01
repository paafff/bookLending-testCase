import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {
    console.log('BookService initialized');
  }

  async getAllBooks() {
    try {
      return this.prisma.book.findMany({
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ BookService ~ getAllBooks ~ error', error);
    }
  }

  getAvailableBooks() {
    try {
      // return this.prisma.book.findMany();
      return this.prisma.book.findMany({
        where: {
          Borrowings: {
            none: {},
          },
        },
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ BookService ~ getAvailableBooks ~ error', error);
    }
  }

  async getBookByCode(code: string) {
    try {
      return this.prisma.book.findUnique({
        where: {
          code: code,
        },
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ BookService ~ getBookByCode ~ error', error);
    }
  }

  async getBookById(id: string) {
    try {
      return this.prisma.book.findUnique({
        where: {
          id,
        },
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('🚀 ~ BookService ~ getBookById ~ error', error);
    }
  }
}
