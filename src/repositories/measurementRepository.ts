import { client } from '../database.js';

export async function findByName(name: string) {
  return client.measurement.findUnique({
    where: { name },
  });
}
