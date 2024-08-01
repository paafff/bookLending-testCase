// src/services/borrowings/dto/create-borrowing.dto.ts
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BorrowingData {
  @ApiProperty({ description: 'ID of the user', type: String })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID of the book', type: String })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;
}

export class CreateBorrowingDto {
  @ApiProperty({ type: BorrowingData })
  @ValidateNested()
  @Type(() => BorrowingData)
  data: BorrowingData;
}
