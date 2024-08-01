import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('available')
  async getAvailableBooks() {
    return this.bookService.getAvailableBooks();
  }

  // @Get(':code')
  // async getBookByCode(@Param('code') code: string) {
  //   return this.bookService.getBookByCode(code);
  // }

  @Get('code/:code')
  async getBookByCode(@Param('code') code: string) {
    return this.bookService.getBookByCode(code);
  }

  @Get('id/:id')
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }
}
