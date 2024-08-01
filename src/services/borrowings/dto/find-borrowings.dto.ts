import { IsOptional, IsString } from 'class-validator';
import { AtLeastOne } from 'src/utils/at-least-one.decorator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class FindBorrowingsDto {
  @ApiProperty({
    description: 'ID of the user',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'ID of the book',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  bookId?: string;

  @AtLeastOne(['userId', 'bookId'], {
    message: 'At least one of userId or bookId must be provided',
  })
  @ApiHideProperty()
  dummyProperty: string; // This property is just a placeholder for the custom validator
}
