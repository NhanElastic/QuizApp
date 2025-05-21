import * as path from 'path';
import { connectionSource } from '../../config/database.config';
import * as fs from 'fs';

async function seed() {
  console.log('Establishing database connection...');
  await connectionSource.initialize();
  if (connectionSource.isInitialized) {
    console.log('Database connection established!\n');
  } else {
    console.error('Database connection failed');
    return;
  }

  const seedingDir = __dirname;

  const seedingFiles = fs
    .readdirSync(seedingDir)
    .filter((file) => file.endsWith('.seed.ts') || file.endsWith('.seed.js'))
    .filter((file) => file !== 'base.seed.ts' && file !== 'base.seed.js')
    .sort();

  for (const file of seedingFiles) {
    const filePath = path.join(seedingDir, file);

    const module = await import(filePath);
    const SeedClass = module.default || module.SeedClass;

    if (!SeedClass) {
      console.warn(`No default export found in seed file: ${file}`);
      continue;
    }

    const seedInstance = new SeedClass(connectionSource);

    await seedInstance.run();

    if (typeof seedInstance.getTableName === 'function') {
      const tableName = await seedInstance.getTableName();
      console.log(`Table [${tableName}] seeded!`);
    } else {
      console.log(`Seed file [${file}] completed!`);
    }
  }

  console.log('\nAll seeds completed!');
  await connectionSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
