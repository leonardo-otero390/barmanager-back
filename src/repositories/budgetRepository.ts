import { Budget } from '@prisma/client';
import { client } from '../database.js';
import { NeededCocktail } from '../interface/cocktailInterfaces.js';
import { NeededCost } from '../interface/costInterfaces.js';
import { NeededDisposable } from '../interface/disposableInterfaces.js';

export async function create(data: Omit<Budget, 'id'>) {
  return client.budget.create({
    data,
  });
}

export async function createDisposables(
  budgetId: number,
  disposables: NeededDisposable[]
) {
  return client.$transaction(
    disposables.map(({ id: disposableId, quantity, measurementId }) =>
      client.budgetDisposable.create({
        data: { disposableId, budgetId, quantity, measurementId },
      })
    )
  );
}

export async function createCosts(budgetId: number, costs: NeededCost[]) {
  return client.$transaction(
    costs.map(({ id: costId, quantity }) =>
      client.budgetCost.create({
        data: { costId, budgetId, quantity },
      })
    )
  );
}

export async function createCocktails(
  budgetId: number,
  cocktails: NeededCocktail[]
) {
  return client.$transaction(
    cocktails.map(({ id: cocktailId, quantity }) =>
      client.budgetCocktail.create({
        data: { cocktailId, budgetId, quantity },
      })
    )
  );
}
