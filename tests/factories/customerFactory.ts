import { faker } from '@faker-js/faker';

export const generateCustomer = () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumber('###########'),
});
