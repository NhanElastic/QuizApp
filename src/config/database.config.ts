import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'password',
  database: process.env.DATABASE_NAME ?? 'quizapp',
  entities: [__dirname + '/../typeorm/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../typeorm/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
};

export default databaseConfig;
export const connectionSource = new DataSource(databaseConfig);
