import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { PrismaModule } from '@infra/prisma/prisma.module';

import { IdentityModule } from '@modules/identity/identity.module';

import { ProfilePrismaRepository } from '@modules/profiles/infrastructure/profile.prisma.repository';

import { CreateProfileUseCase } from '@modules/profiles/application/use-cases/create-profile.usecase';

import { GetMyProfileUseCase } from '@modules/profiles/application/use-cases/get-my-profile.usecase';

import { UpdateProfileUseCase } from '@modules/profiles/application/use-cases/update-profile.usecase';

import { GetPublicProfileUseCase } from '@modules/profiles/application/use-cases/get-public-profile.usecase';

import { ProfileController } from '@modules/profiles/presentation/profile.controller';

@Module({
  imports: [
    PrismaModule,

    forwardRef(
      () => IdentityModule,
    ),
  ],

  controllers: [
    ProfileController,
  ],

  providers: [
    // Repository
    ProfilePrismaRepository,

    {
      provide: 'ProfileRepository',

      useExisting:
        ProfilePrismaRepository,
    },

    // Create Profile
    {
      provide: CreateProfileUseCase,

      useFactory: (repo) =>
        new CreateProfileUseCase(
          repo,
        ),

      inject: ['ProfileRepository'],
    },

    // Get My Profile
    {
      provide: GetMyProfileUseCase,

      useFactory: (repo) =>
        new GetMyProfileUseCase(
          repo,
        ),

      inject: ['ProfileRepository'],
    },

    // Update Profile
    {
      provide: UpdateProfileUseCase,

      useFactory: (repo) =>
        new UpdateProfileUseCase(
          repo,
        ),

      inject: ['ProfileRepository'],
    },

    // Public Profile
    {
      provide: GetPublicProfileUseCase,

      useFactory: (repo) =>
        new GetPublicProfileUseCase(
          repo,
        ),

      inject: ['ProfileRepository'],
    },
  ],

  exports: [
    'ProfileRepository',

    CreateProfileUseCase,

    GetMyProfileUseCase,

    UpdateProfileUseCase,

    GetPublicProfileUseCase,
  ],
})
export class ProfilesModule {}