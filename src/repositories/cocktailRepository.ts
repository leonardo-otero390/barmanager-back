import { client } from '../database.js';

export async function findMany() {
  return client.cocktail.findMany();
}
