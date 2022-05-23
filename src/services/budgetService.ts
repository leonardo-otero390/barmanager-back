import * as cocktailService from './cocktailService.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import * as disposableService from './disposableService.js';
import * as costService from './costService.js';
import { NeededCost } from '../interface/costInterfaces.js';
import { NeededDisposable } from '../interface/disposableInterfaces.js';

interface Request {
  guests: number;
  cocktails: number[];
  customerId: number;
  categoryId: number;
}

interface Cocktail {
  name: string;
  quantity: number;
  price: number;
}

function buildBudget(
  costs: NeededCost[],
  cocktails: Cocktail[],
  disposables: NeededDisposable[]
) {
  interface ListTotal {
    list: NeededCost[] | Cocktail[];
    total: number;
  }
  const result: {
    costs: ListTotal;
    cocktails: ListTotal;
    disposables: ListTotal;
    total: number;
  } = {
    costs: { list: [], total: 0 },
    cocktails: { list: [], total: 0 },
    disposables: { list: [], total: 0 },
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

  let disposableTotal = 0;
  const disposableList: {
    name: string;
    price: number;
    quantity: number;
    measurement: string;
  }[] = [];
  disposables.forEach((disposable) => {
    disposableTotal += disposable.price;
    disposableList.push({
      name: disposable.name,
      price: disposable.price,
      quantity: disposable.quantity,
      measurement: 'unidade',
    });
  });
  result.disposables = { list: disposableList, total: disposableTotal };

  result.total = costTotal + cocktailTotal + disposableTotal;
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

  await cocktailService.insertToBudget(budget.id, cocktailPrices);

  const costs = await costService.calculate(guests);
  await costService.insertToBudget(costs, budget.id);

  const disposables = await disposableService.calculate(cocktailsQnt);
  await disposableService.insertToBudget(budget.id, disposables);

  return buildBudget(costs, cocktailPrices, disposables);
}
