import { client } from '../database.js';
import { NewCustomerData } from '../interface/customerInterfaces.js';

export async function findById(id: number) {
  return client.customer.findUnique({
    where: {
      id,
    },
  });
}
export async function findByEmail(email: string) {
  return client.customer.findUnique({
    where: {
      email,
    },
  });
}

export async function insert(customer: NewCustomerData) {
  return client.customer.create({
    data: customer,
  });
}
