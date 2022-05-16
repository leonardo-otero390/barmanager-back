import { Customer } from '@prisma/client';

export type NewCustomerData = Omit<Customer, 'id'>;

export interface CustomerLogin {
  email: string;
  password: string;
}
