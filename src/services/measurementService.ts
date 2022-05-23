export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (
    (fromUnit === 'grama' && toUnit === 'kilograma') ||
    (fromUnit === 'mililitro' && toUnit === 'litro')
  ) {
    return value / 1000;
  }
  return 0;
}
