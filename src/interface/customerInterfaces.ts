import { Customer } from '@prisma/client';

export type NewCustomerData = Omit<Customer, 'id'>;
