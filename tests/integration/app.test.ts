import supertest from 'supertest';
import app from '../../src/app.js';
import { client } from '../../src/database.js';
import * as customerFactory from '../factories/customerFactory.js';
import * as databaseUtil from '../util/database.js';

beforeEach(async () => {
  await databaseUtil.clearCustomers();
});

afterAll(async () => {
  await client.$disconnect();
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

describe('GET /cocktails', () => {
  beforeAll(async () => {
    await databaseUtil.seed();
  });
  it('should return a list of cocktails', async () => {
    const response = await supertest(app).get('/cocktails');
    expect(response.status).toEqual(200);
    expect(response.body[0]).toHaveProperty('name');
  });
});
