import { User } from '../entities/user.entity';

export interface UserRepository {
  // ======================================================
  // FIND USER
  // ======================================================

  // Find by phone number
  findByPhone(
    phone: string,
  ): Promise<User | null>;

  // Find by email (Admin Login)
  findByEmail(
    email: string,
  ): Promise<User | null>;

  // Find by id
  findById(
    id: string,
  ): Promise<User | null>;

  // ======================================================
  // CREATE USER
  // ======================================================

  create(data: {
    // User Auth
    phone?: string;
    email?: string;

    // Admin Password Login
    passwordHash?: string;

    // Metadata
    country?: string;
    source?: string;

    // RBAC
    role: string;
  }): Promise<User>;

  // ======================================================
  // UPDATE USER
  // ======================================================

  save(user: User): Promise<void>;
}