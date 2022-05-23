import { Cocktail } from '@prisma/client';

export interface NeededCocktail extends Cocktail {
  quantity: number;
}
