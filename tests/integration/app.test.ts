import supertest from 'supertest';
import app from '../../src/app.js';
import { client } from '../../src/database.js';
import * as customerFactory from '../factories/customerFactory.js';

beforeEach(async () => {
  await client.$executeRaw`TRUNCATE TABLE customers CASCADE;`;
});

describe('POST /sign-up', () => {
  it('should persist the customer given a valid body', async () => {
    const customer = customerFactory.generateCustomer();

    const response = await supertest(app).post('/sign-up').send(customer);
    const createdUser = await client.customer.findUnique({
      where: { email: customer.email },
    });

    expect(response.status).toEqual(201);
    expect(createdUser).not.toBeNull();
  });
});

describe('POST /log-in', () => {
  it('should return a valid token given a valid body', async () => {
    const customer = customerFactory.generateCustomer();
    await customerFactory.insertCustomer(customer);

    const response = await supertest(app).post('/log-in').send({
      email: customer.email,
      password: customer.password,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });
});
