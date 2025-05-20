import * as path from 'path';
import { connectionSource } from '../../config/database.config';
import * as fs from 'fs';

async function seed() {
  console.log('Establishing database connection...');
  await connectionSource.initialize();
  if (connectionSource.isInitialized)
    console.log('Database connection established!\n');
  else {
    console.error('Database connection failed');
    return;
  }

  const seedingDir = path.join(__dirname);
  const seedingFiles = fs
    .readdirSync(seedingDir)
    .filter((file: string) => file.endsWith('.seed.ts'))
    .filter((file: string) => file !== 'base.seed.ts');

  for (const file of seedingFiles) {
    const filePath = path.join(seedingDir, file);
    const { default: SeedClass } = await import(filePath);

    const seed = new SeedClass();
    await seed.run();

    const tableName = await seed.getTableName();
    console.log(`Table [${tableName}] seeded!`);
  }
  console.log();
}

seed().then(() => {
  console.log('SEEDING COMPLETED!!!');
  process.exit(0);
});
