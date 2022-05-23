import { client } from '../database.js';

export async function findMany() {
  return client.cost.findMany();
}
