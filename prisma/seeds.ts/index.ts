import { client } from '../../src/database.js';

async function main() {
  return 0;
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
