import { connectionSource } from '../../config/database.config';

export default abstract class BaseSeed {
  [key: string]: any;

  protected listTable: string[] = [];

  constructor(kwargs: object) {
    for (const key in kwargs) {
      this[key] = connectionSource.getRepository(kwargs[key]);
      this.listTable.push(this[key].metadata.tableName);
    }
  }

  public abstract run(): Promise<void>;

  public async getTableName(): Promise<string> {
    return this.listTable.join(', ');
  }
}
