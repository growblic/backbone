import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@modules/identity/presentation/guards/jwt-auth.guard';

import { GetMyProfileUseCase } from '@modules/profiles/application/use-cases/get-my-profile.usecase';

import { UpdateProfileUseCase } from '@modules/profiles/application/use-cases/update-profile.usecase';

import { GetPublicProfileUseCase } from '@modules/profiles/application/use-cases/get-public-profile.usecase';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  constructor(
    private readonly getMyProfile:
      GetMyProfileUseCase,

    private readonly updateProfile:
      UpdateProfileUseCase,

    private readonly getPublicProfile:
      GetPublicProfileUseCase,
  ) {}

  // =========================
  // GET MY PROFILE
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async getProfile(
    @Req() req: any,
  ) {
    console.log(
      'JWT USER =>',
      req.user,
    );

    return this.getMyProfile.execute(
      req.user.sub,
    );
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  @UseGuards(JwtAuthGuard)
  @Patch('me/profile')
  async update(
    @Req() req: any,

    @Body() body: UpdateProfileDto,
  ) {
    return this.updateProfile.execute(
      req.user.sub,
      body,
    );
  }

  // =========================
  // PUBLIC PROFILE
  // =========================
  @Get('profiles/:username')
  async publicProfile(
    @Param('username')
    username: string,
  ) {
    return this.getPublicProfile.execute(
      username,
    );
  }
}