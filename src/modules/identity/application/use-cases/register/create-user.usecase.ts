import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository';
import { Role } from '@modules/identity/domain/enums/role.enum';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: UserRepository,
  ) {}

  async execute(phone: string, country: string, source: string) {
    // ✅ check if already exists
    const existing = await this.userRepo.findByPhone(phone);

    if (existing) {
      return existing;
    }

    // ✅ create user
    const user = await this.userRepo.create({
      phone,
      country,
      source,
      role: Role.USER,
    });

    return user;
  }
}