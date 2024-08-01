import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { BorrowingStatus } from '@prisma/client';

@Injectable()
export class SchedulerService {
  constructor(private prisma: PrismaService) {}

  // @Cron('* * * * *') //every minute for test working
  @Cron('0 0 1 * *')
  async penaltyUserLateReturnedBook() {
    console.log('Called every day at 1 AM');
    const borrowings = await this.prisma.borrowings.findMany({
      where: {
        status: BorrowingStatus.BORROWED,
      },
    });

    const currentDate = new Date();

    borrowings.forEach(async (borrowing) => {
      const dueDate = new Date(borrowing.dueAt);
      if (currentDate > dueDate) {
        await this.prisma.user.update({
          where: {
            id: borrowing.userId,
          },
          data: {
            penalty: true,
          },
        });
      }
    });
  }
}
