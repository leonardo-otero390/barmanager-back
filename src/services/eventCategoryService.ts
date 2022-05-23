import * as eventCategoryRepository from '../repositories/eventCategoryRepository.js';

export async function findMany() {
  return eventCategoryRepository.findMany();
}

export async function find(id: number) {
  return eventCategoryRepository.find(id);
}
