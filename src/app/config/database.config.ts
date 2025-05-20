import { registerAs } from '@nestjs/config';
import databaseConfig from '../../config/database.config';

export default registerAs('database', () => databaseConfig);
