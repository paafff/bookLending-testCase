import { Module } from '@nestjs/common';
import { InitializationModule } from './services/initialization/initialization.module';
import { UserModule } from './services/user/user.module';
import { BookModule } from './services/book/book.module';
import { BorrowingsModule } from './services/borrowings/borrowings.module';
import { SchedulerModule } from './services/scheduler/scheduler.module';

@Module({
  imports: [
    InitializationModule,
    UserModule,
    BookModule,
    BorrowingsModule,
    SchedulerModule,
  ],
  providers: [],
})
export class AppModule {}
