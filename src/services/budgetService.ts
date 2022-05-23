import { Cost } from '@prisma/client';
import * as cocktailService from './cocktailService.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import * as costRepository from '../repositories/costRepository.js';

interface Request {
  guests: number;
  cocktails: number[];
  customerId: number;
  categoryId: number;
}

interface NeededCost extends Cost {
  quantity: number;
}

async function calculateCosts(guests: number) {
  const costs = await costRepository.findMany();
  const neededCosts: NeededCost[] = [];

  const bartenderQuantity = Math.ceil(guests / 60);
  const captainQuantity = Math.ceil(bartenderQuantity / 3);

  costs.forEach((cost) => {
    let toPush = { ...cost, quantity: 1 };
    if (cost.name === 'Bartender') {
      toPush = {
        ...cost,
        quantity: bartenderQuantity,
        price: cost.price * bartenderQuantity,
      };
    }
    if (cost.name === 'Capitão') {
      toPush = {
        ...cost,
        quantity: captainQuantity,
        price: cost.price * captainQuantity,
      };
    }
    if (
      cost.name === 'Lavanderia' ||
      cost.name === 'Depreciação de equipamento'
    ) {
      toPush = {
        ...cost,
        quantity: bartenderQuantity + captainQuantity,
        price: (bartenderQuantity + captainQuantity) * cost.price,
      };
    }
    neededCosts.push(toPush);
  });

  return neededCosts;
}

export async function insertCosts(costs: NeededCost[], budgetId: number) {
  await budgetRepository.createCosts(budgetId, costs);
}

interface Cocktail {
  name: string;
  quantity: number;
  price: number;
}

function buildBudget(costs: NeededCost[], cocktails: Cocktail[]) {
  interface ListTotal {
    list: NeededCost[] | Cocktail[];
    total: number;
  }
  const result: {
    costs: ListTotal;
    cocktails: ListTotal;
    total: number;
  } = {
    costs: { list: [], total: 0 },
    cocktails: { list: [], total: 0 },
    total: 0,
  };

  let costTotal = 0;
  costs.forEach((cost) => {
    costTotal += cost.price;
  });
  result.costs = { list: costs, total: costTotal };

  let cocktailTotal = 0;
  cocktails.forEach((cocktail) => {
    cocktailTotal += cocktail.price;
  });
  result.cocktails = { list: cocktails, total: cocktailTotal };

  result.total = costTotal + cocktailTotal;
  return result;
}

export async function create({
  guests,
  cocktails,
  customerId,
  categoryId,
}: Request) {
  const cocktailsQnt = guests * 4;
  const eachCocktailQnt = Math.ceil(cocktailsQnt / cocktails.length);

  const cocktailPrices = await cocktailService.calculatePrices(
    cocktails,
    eachCocktailQnt
  );

  const budget = await budgetRepository.create({
    guests,
    customerId,
    categoryId,
  });

  const costs = await calculateCosts(guests);
  await insertCosts(costs, budget.id);

  return buildBudget(costs, cocktailPrices);
}
