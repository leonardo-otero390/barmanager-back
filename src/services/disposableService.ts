import * as disposableRepository from '../repositories/disposableRepository.js';
import * as budgetRepository from '../repositories/budgetRepository.js';
import { NeededDisposable } from '../interface/disposableInterfaces.js';
import * as measurementService from './measurementService.js';

export async function calculate(cocktailsQnt: number) {
  const disposables = await disposableRepository.findMany();
  const { id: measurementId } = await measurementService.findByName('unidade');
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

export async function insertToBudget(
  budgetId: number,
  disposables: NeededDisposable[]
) {
  await budgetRepository.createDisposables(budgetId, disposables);
}
