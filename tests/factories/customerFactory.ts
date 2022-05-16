import { faker } from '@faker-js/faker';
import { Customer } from '@prisma/client';
import bcrypt from 'bcrypt';
import { client } from '../../src/database';

export const generateCustomer = () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumber('###########'),
});

export async function insertCustomer(data: Omit<Customer, 'id'>) {
  const hashedPassword = bcrypt.hashSync(data.password, 12);
  await client.customer.create({ data: { ...data, password: hashedPassword } });
}
