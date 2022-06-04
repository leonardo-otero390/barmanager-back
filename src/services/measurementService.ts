import * as measurementRepository from '../repositories/measurementRepository.js';

export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (
    (fromUnit === 'gram' && toUnit === 'kilogram') ||
    (fromUnit === 'mililiter' && toUnit === 'liter') ||
    (fromUnit === 'unity' && toUnit === 'thousand')
  ) {
    return value / 1000;
  }
  if (fromUnit === 'unity' && toUnit === 'hundred') {
    return value / 100;
  }
  return 0;
}

export async function findByName(name: string) {
  return measurementRepository.findByName(name);
}
