export function convertToReal(price: number): string {
  const decimal = (price / 100).toFixed(2).replace('.', ',');
  return `$ ${decimal}`;
}
