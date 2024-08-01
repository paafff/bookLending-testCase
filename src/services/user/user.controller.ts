import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get user by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'The code of the user',
  })
  @ApiResponse({ status: 200, description: 'Return user by code.' })
  async getUserByCode(@Param('code') code: string) {
    return this.userService.getUserByCode(code);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Return user by ID.' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
