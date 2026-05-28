import { Role } from '../enums/role.enum';

export type User = {
  id: string;

  phone: string;

  email: string | null;

  passwordHash: string | null;

  country: string;

  source: string;

  role: string;

  createdAt: Date;

  updatedAt: Date;
};