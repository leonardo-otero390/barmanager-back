/* eslint-disable no-console */
import { client } from '../../src/database.js';
import { upsertCocktails } from './populateCocktails.js';
import { upsertDisposables } from './populateDisposables.js';
import { upsertDrinks } from './populateDrinks.js';
import { upsertInputs } from './populateInputs.js';
import { upsertMeasurement } from './populateMeasurement.js';

async function main() {
  await upsertMeasurement();
  await upsertDrinks();
  await upsertInputs();
  await upsertDisposables();
  await upsertCocktails();
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
