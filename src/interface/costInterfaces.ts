import { Cost } from '@prisma/client';

export interface NeededCost extends Cost {
  quantity: number;
}

export interface FormatedCost extends Omit<Cost, 'price'> {
  quantity: number;
  price: string;
}
