import * as cocktailRepository from '../repositories/cocktailRepository.js';

export async function findMany() {
  const cocktails = await cocktailRepository.findMany();
  return cocktails;
}
