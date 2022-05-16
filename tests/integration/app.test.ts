import supertest from 'supertest';
import app from '../../src/app.js';
import { client } from '../../src/database.js';
import * as customerFactory from '../factories/customerFactory.js';

describe('Integration Tests', () => {
  describe('POST /sign-up', () => {
    beforeEach(async () => {
      await client.$executeRaw`TRUNCATE TABLE customers CASCADE;`;
    });

    it('should persist the user given a valid body', async () => {
      const customer = customerFactory.generateCustomer();

      const response = await supertest(app).post('/sign-up').send(customer);
      const createdUser = await client.customer.findUnique({
        where: { email: customer.email },
      });

      expect(response.status).toEqual(201);
      expect(createdUser).not.toBeNull();
    });
  });
});
