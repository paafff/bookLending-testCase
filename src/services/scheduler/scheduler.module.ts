import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(),PrismaModule],
  controllers: [],
  providers: [SchedulerService],
})
export class SchedulerModule {}
