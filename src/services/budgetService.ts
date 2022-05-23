import { Customer } from '@prisma/client';
import * as cocktailService from './cocktailService.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import * as eventCategoryService from '../services/eventCategoryService.js';
import * as disposableService from './disposableService.js';
import * as costService from './costService.js';
import * as currencyService from './currencyService.js';
import { NeededCost } from '../interface/costInterfaces.js';
import { NeededDisposable } from '../interface/disposableInterfaces.js';
import { httpErrors } from '../errors/HttpError.js';
import {
  BudgetCosts,
  FormatedBudget,
  RawBudget,
} from '../interface/budgetInterfaces.js';
import { CocktailPrice as Cocktail } from '../interface/cocktailInterfaces.js';

interface Request {
  guests: number;
  cocktails: number[];
  customer: Customer;
  categoryId: number;
}

function buildBudgetCosts(
  costs: NeededCost[],
  cocktails: Cocktail[],
  disposables: NeededDisposable[]
) {
  const result: BudgetCosts = {
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

function formatCurrency(budget: RawBudget) {
  const { budgetCosts, sellPrice, ...data } = budget;

  const totalCosts = currencyService.convertToReal(budgetCosts.costs.total);
  const totalCocktails = currencyService.convertToReal(
    budgetCosts.cocktails.total
  );
  const totalDisposables = currencyService.convertToReal(
    budgetCosts.disposables.total
  );
  const total = currencyService.convertToReal(budgetCosts.total);

  const result: FormatedBudget = {
    ...data,
    budgetCosts: {
      costs: { list: [], total: totalCosts },
      cocktails: { list: [], total: totalCocktails },
      disposables: { list: [], total: totalDisposables },
      total,
    },
    sellPrice: currencyService.convertToReal(sellPrice),
  };

  budgetCosts.costs.list.forEach((cost) => {
    result.budgetCosts.costs.list.push({
      ...cost,
      price: currencyService.convertToReal(cost.price),
    });
  });

  budgetCosts.cocktails.list.forEach((cocktail) => {
    result.budgetCosts.cocktails.list.push({
      ...cocktail,
      price: currencyService.convertToReal(cocktail.price),
    });
  });

  budgetCosts.disposables.list.forEach((disposable) => {
    result.budgetCosts.disposables.list.push({
      ...disposable,
      price: currencyService.convertToReal(disposable.price),
    });
  });
  return result;
}

export async function create({
  guests,
  cocktails,
  customer,
  categoryId,
}: Request) {
  const cocktailsQnt = guests * 4;
  const eachCocktailQnt = Math.ceil(cocktailsQnt / cocktails.length);
  const category = await eventCategoryService.find(categoryId);
  if (!category) {
    throw httpErrors.notFound(
      `Não foi encontrado a categoria de id: ${categoryId}`
    );
  }

  const cocktailPrices = await cocktailService.calculatePrices(
    cocktails,
    eachCocktailQnt
  );

  const budget = await budgetRepository.create({
    guests,
    customerId: customer.id,
    categoryId,
  });

  await cocktailService.insertToBudget(budget.id, cocktailPrices);

  const costs = await costService.calculate(guests);
  await costService.insertToBudget(costs, budget.id);

  const disposables = await disposableService.calculate(cocktailsQnt);
  await disposableService.insertToBudget(budget.id, disposables);

  const budgetCosts = buildBudgetCosts(costs, cocktailPrices, disposables);

  const sellPrice = Math.ceil(budgetCosts.total * 1.2);

  const { id, password, ...publicCustomer } = customer;

  return formatCurrency({
    customer: publicCustomer,
    category: category.name,
    guests,
    budgetCosts,
    sellPrice,
  });
}
