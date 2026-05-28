import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';

import { GetAdminUsersDto } from '../dto/get-admin-users.dto';

import { GetAdminUsersUseCase } from '../../application/use-cases/get-admin-users.usecase';

import { GetAdminUserDetailsUseCase } from '../../application/use-cases/get-admin-user-details.usecase';

import { AdminJwtGuard } from '@modules/backoffice/admin-auth/infrastructure/guards/admin-jwt.guard';

@Controller({
  path: 'backoffice/users',
  version: '1',
})
export class AdminUsersController {
  constructor(
    private readonly getAdminUsersUseCase: GetAdminUsersUseCase,

    private readonly getAdminUserDetailsUseCase: GetAdminUserDetailsUseCase,
  ) {}

  @UseGuards(AdminJwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(
    @Query()
    query: GetAdminUsersDto,
  ) {
    const page = Number(
      query.page || 1,
    );

    const limit = Number(
      query.limit || 20,
    );

    return this.getAdminUsersUseCase.execute(
      page,
      limit,
      query.search,
    );
  }

  @UseGuards(AdminJwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') id: string,
  ) {
    return this.getAdminUserDetailsUseCase.execute(
      id,
    );
  }
}