import { Role } from '../enums/role.enum';

export type User = {
  id: string;

  phone: string;

  country: string;

  source: string;

  role: string;

  createdAt: Date;

  updatedAt: Date;
};