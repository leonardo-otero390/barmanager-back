import { Budget, Cost, Disposable } from '@prisma/client';
import { client } from '../database.js';

export async function create(data: Omit<Budget, 'id'>) {
  return client.budget.create({
    data,
  });
}

interface CostNeeded extends Cost {
  quantity: number;
}

interface DisposableNeeded extends Disposable {
  quantity: number;
}

export async function createDisposables(
  budgetId: number,
  disposables: DisposableNeeded[]
) {
  return client.$transaction(
    disposables.map(({ id: disposableId, quantity, measurementId }) =>
      client.budgetDisposable.create({
        data: { disposableId, budgetId, quantity, measurementId },
      })
    )
  );
}

export async function createCosts(budgetId: number, costs: CostNeeded[]) {
  return client.$transaction(
    costs.map(({ id: costId, quantity }) =>
      client.budgetCost.create({
        data: { costId, budgetId, quantity },
      })
    )
  );
}
