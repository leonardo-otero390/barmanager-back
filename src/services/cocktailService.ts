import * as cocktailRepository from '../repositories/cocktailRepository.js';

export async function findMany() {
  return cocktailRepository.findMany();
}
