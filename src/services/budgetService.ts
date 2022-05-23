import { Cost, Disposable } from '@prisma/client';
import * as cocktailService from './cocktailService.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import * as costRepository from '../repositories/costRepository.js';
import * as disposableRepository from '../repositories/disposableRepository.js';
import * as measurementRepository from '../repositories/measurementRepository.js';
import * as measurementService from './measurementService.js';

interface Request {
  guests: number;
  cocktails: number[];
  customerId: number;
  categoryId: number;
}

interface NeededCost extends Cost {
  quantity: number;
}

interface NeededDisposable extends Disposable {
  quantity: number;
}

async function calculateDisposables(cocktailsQnt: number) {
  const disposables = await disposableRepository.findMany();
  const { id: measurementId } = await measurementRepository.findByName(
    'unidade'
  );
  const neededDisposables: NeededDisposable[] = [];

  disposables.forEach((disposable) => {
    const totalQuantity = measurementService.convertUnits(
      cocktailsQnt,
      'unidade',
      disposable.measurement.name
    );
    neededDisposables.push({
      ...disposable,
      quantity: cocktailsQnt,
      measurementId,
      price: Math.ceil(disposable.price * totalQuantity),
    });
  });

  return neededDisposables;
}

async function insertDisposables(
  budgetId: number,
  disposables: NeededDisposable[]
) {
  await budgetRepository.createDisposables(budgetId, disposables);
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

  const costs = await calculateCosts(guests);
  await insertCosts(costs, budget.id);

  const disposables = await calculateDisposables(cocktailsQnt);
  await insertDisposables(budget.id, disposables);

  return buildBudget(costs, cocktailPrices, disposables);
}
