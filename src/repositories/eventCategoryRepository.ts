import { client } from '../database.js';

export async function find(id: number) {
  return client.eventCategory.findUnique({ where: { id } });
}
