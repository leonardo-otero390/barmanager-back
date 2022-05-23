import { client } from '../database.js';

export async function findMany() {
  return client.disposable.findMany({ include: { measurement: true } });
}
