import * as costRepository from '../repositories/costRepository.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import { NeededCost } from '../interface/costInterfaces.js';

export async function calculate(guests: number) {
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
    if (cost.name === 'Bartender leader') {
      toPush = {
        ...cost,
        quantity: captainQuantity,
        price: cost.price * captainQuantity,
      };
    }
    if (cost.name === 'Laundry' || cost.name === 'Equipment depreciation') {
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

export async function insertToBudget(costs: NeededCost[], budgetId: number) {
  await budgetRepository.createCosts(budgetId, costs);
}
