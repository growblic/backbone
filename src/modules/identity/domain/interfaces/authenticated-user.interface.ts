import { Role } from '../enums/role.enum';

export interface AuthenticatedUser {
  id: string;

  phone: string;

  role: Role;

  country: string;

  source: string;
}