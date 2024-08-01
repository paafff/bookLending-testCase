import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulerService } from './scheduler.service';
import { Borrowings, BorrowingStatus } from '@prisma/client';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: PrismaService,
          useValue: {
            borrowings: {
              findMany: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('penaltyUserLateReturnedBook', () => {
    it('should penalize users with late returned books', async () => {
      const borrowings: Borrowings[] = [
        {
          id: 1,
          userId: '1',
          dueAt: new Date(Date.now() - 86400000),
          status: BorrowingStatus.BORROWED,
          bookId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // 1 day overdue
        {
          id: 2,
          userId: '2',
          dueAt: new Date(Date.now() + 86400000),
          status: BorrowingStatus.BORROWED,
          bookId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // not overdue
      ];

      jest
        .spyOn(prismaService.borrowings, 'findMany')
        .mockResolvedValue(borrowings);
      const updateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(null);

      await service.penaltyUserLateReturnedBook();

      expect(prismaService.borrowings.findMany).toHaveBeenCalledWith({
        where: {
          status: BorrowingStatus.BORROWED,
        },
      });

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { penalty: true },
      });
    });
  });
});
