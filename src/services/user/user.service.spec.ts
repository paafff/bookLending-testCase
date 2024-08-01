import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserService } from './user.service';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const expectedResult: User[] = [
        {
          id: '1',
          name: 'User Name',
          code: 'USR123',
          createdAt: new Date(),
          updatedAt: new Date(),
          penalty: false,
          penaltyUntil: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue(expectedResult);

      const result = await service.getAllUsers();
      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    });
  });

  describe('getUserByCode', () => {
    it('should return a user by code', async () => {
      const code = 'USR123';
      const expectedResult: User = {
        id: '1',
        name: 'User Name',
        code: 'USR123',
        createdAt: new Date(),
        updatedAt: new Date(),
        penalty: false,
        penaltyUntil: new Date(),
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.getUserByCode(code);
      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { code },
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const expectedResult: User = {
        id: '1',
        name: 'User Name',
        code: 'USR123',
        createdAt: new Date(),
        updatedAt: new Date(),
        penalty: false,
        penaltyUntil: new Date(),
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.getUserById(id);
      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          Borrowings: {
            include: {
              Book: true,
            },
          },
        },
      });
    });
  });
});
