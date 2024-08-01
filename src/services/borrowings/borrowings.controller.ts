import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { BorrowingsService } from './borrowings.service';
import { FindBorrowingsDto } from './dto/find-borrowings.dto';
import { Prisma } from '@prisma/client';
import { CreateBorrowingDto } from './dto/create-borrowings.dto';

@ApiTags('borrowings')
@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all borrowings' })
  @ApiResponse({ status: 200, description: 'Return all borrowings.' })
  async getAllBorrowings() {
    return this.borrowingsService.getAllBorrowings();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get borrowing by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the borrowing',
  })
  @ApiResponse({ status: 200, description: 'Return borrowing by ID.' })
  async getBorrowingById(@Param('id') id: number) {
    return this.borrowingsService.getBorrowingById(id);
  }

  @Post('find')
  @ApiOperation({ summary: 'Find borrowings by user ID or book ID' })
  @ApiBody({ type: FindBorrowingsDto })
  @ApiResponse({
    status: 200,
    description: 'Return borrowings based on user ID or book ID.',
  })
  async findBorrowingsByUserIdOrBookId(
    @Body() findBorrowingsDto: FindBorrowingsDto,
  ) {
    return this.borrowingsService.findBorrowingsByUserIdOrBookId(
      findBorrowingsDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new borrowing' })
  @ApiBody({ type: CreateBorrowingDto })
  @ApiResponse({
    status: 201,
    description: 'The borrowing has been successfully created.',
  })
  async createBorrowing(
    @Body() borrowingsCreateArgs: Prisma.BorrowingsCreateArgs,
  ) {
    return this.borrowingsService.createBorrowing(borrowingsCreateArgs);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a borrowing' })
  // @ApiParam({
  //   name: 'id',
  //   type: 'number',
  //   description: 'The ID of the borrowing',
  // })
  // // @ApiBody({ type: Prisma.BorrowingsUpdateInput })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The borrowing has been successfully updated.',
  // })
  // async updateBorrowing(
  //   @Param('id') id: number,
  //   @Body() data: Prisma.BorrowingsUpdateInput,
  // ) {
  //   return this.borrowingsService.updateBorrowing(id, data);
  // }

  @Patch('returned/:id')
  @ApiOperation({ summary: 'Mark a borrowing as returned' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the borrowing',
  })
  @ApiResponse({
    status: 200,
    description: 'The borrowing has been successfully marked as returned.',
  })
  async returnedBorrowing(@Param('id') id: number) {
    return this.borrowingsService.returnedBorrowing(id);
  }
}
