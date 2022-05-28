import { Cocktail } from '@prisma/client';

export interface NeededCocktail extends Cocktail {
  quantity: number;
}

export interface CocktailPrice {
  name: string;
  quantity: number;
  price: number;
}

export interface FormatedCocktailPrice extends Omit<CocktailPrice, 'price'> {
  price: string;
}

export type CocktailWithInputs = Cocktail & {
  cocktailInputs: {
    quantity: number;
    measurement: {
      name: string;
    };
    inputs: {
      price: number;
      name: string;
      measurement: {
        name: string;
      };
    };
  }[];
};
