/* eslint-disable no-console */
import { client } from '../../src/database.js';
import { upsertCocktails } from './populateCocktails.js';
import { upsertCosts } from './populateCosts.js';
import { upsertDisposables } from './populateDisposables.js';
import { upsertEventCategories } from './populateEventCategories.js';
import { upsertMeasurement } from './populateMeasurement.js';

export default async function main() {
  await upsertEventCategories();
  await upsertCosts();
  await upsertMeasurement();
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
