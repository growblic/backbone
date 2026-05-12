import { User } from '../entities/user.entity';

export interface UserRepository {
  // 🔍 find by phone
  findByPhone(
    phone: string,
  ): Promise<User | null>;

  // 🔍 find by id
  findById(
    id: string,
  ): Promise<User | null>;

  // 🆕 create user
  create(data: {
    phone: string;

    country: string;

    source: string;

    role: string;
  }): Promise<User>;

  // 💾 save user
  save(user: User): Promise<void>;
}