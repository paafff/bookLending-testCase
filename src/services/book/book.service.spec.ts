import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { BookService } from './book.service';
import { Book } from '@prisma/client';

describe('BookService', () => {
  let service: BookService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      const expectedResult: Book[] = [
        {
          id: '1',
          title: 'Book Title',
          code: 'BK123',
          author: 'Author Name',
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: 10,
        },
      ];
      jest
        .spyOn(prismaService.book, 'findMany')
        .mockResolvedValue(expectedResult);

      const result = await service.getAllBooks();
      expect(result).toEqual(expectedResult);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    });
  });

  describe('getAvailableBooks', () => {
    it('should return available books', async () => {
      const expectedResult: Book[] = [
        {
          id: '1',
          title: 'Book Title',
          code: 'BK123',
          author: 'Author Name',
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: 10,
        },
      ];
      jest
        .spyOn(prismaService.book, 'findMany')
        .mockResolvedValue(expectedResult);

      const result = await service.getAvailableBooks();
      expect(result).toEqual(expectedResult);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('getBookByCode', () => {
    it('should return a book by code', async () => {
      const code = 'BK123';
      const expectedResult: Book = {
        id: '1',
        title: 'Book Title',
        code: 'BK123',
        author: 'Author Name',
        createdAt: new Date(),
        updatedAt: new Date(),
        stock: 10,
      };
      jest
        .spyOn(prismaService.book, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.getBookByCode(code);
      expect(result).toEqual(expectedResult);
      expect(prismaService.book.findUnique).toHaveBeenCalledWith({
        where: { code },
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    });
  });

  describe('getBookById', () => {
    it('should return a book by id', async () => {
      const id = '1';
      const expectedResult: Book = {
        id: '1',
        title: 'Book Title',
        code: 'BK123',
        author: 'Author Name',
        createdAt: new Date(),
        updatedAt: new Date(),
        stock: 10,
      };
      jest
        .spyOn(prismaService.book, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.getBookById(id);
      expect(result).toEqual(expectedResult);
      expect(prismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          Borrowings: {
            include: {
              User: true,
            },
          },
        },
      });
    });
  });
});
