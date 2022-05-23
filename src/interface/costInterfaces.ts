import { Cost } from '@prisma/client';

export interface NeededCost extends Cost {
  quantity: number;
}
