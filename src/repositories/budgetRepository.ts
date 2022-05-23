import { Budget, Cost } from '@prisma/client';
import { client } from '../database.js';

export async function create(data: Omit<Budget, 'id'>) {
  return client.budget.create({
    data,
  });
}

interface CostNeeded extends Cost {
  quantity: number;
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
