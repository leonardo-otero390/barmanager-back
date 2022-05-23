import * as measurementRepository from '../repositories/measurementRepository.js';

export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (
    (fromUnit === 'grama' && toUnit === 'kilograma') ||
    (fromUnit === 'mililitro' && toUnit === 'litro') ||
    (fromUnit === 'unidade' && toUnit === 'milhar')
  ) {
    return value / 1000;
  }
  if (fromUnit === 'unidade' && toUnit === 'centena') {
    return value / 100;
  }
  return 0;
}

export async function findByName(name: string) {
  return measurementRepository.findByName(name);
}
