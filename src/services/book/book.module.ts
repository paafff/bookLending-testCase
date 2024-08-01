import { BookService } from './book.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { BookController } from './book.controller';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
