import { UserEntity } from '../entities/user.entity';
import BaseSeed from './base.seed';

export default class UserSeed extends BaseSeed {
  constructor() {
    super({
      repo: UserEntity,
    });
  }

  public async run(): Promise<void> {
    // Kiểm tra admin
    const adminUser = await this.repo.findOneBy({ username: 'admin' });
    if (!adminUser) {
      const admin = this.repo.create({
        username: 'admin',
        password: 'admin',
        role: 'admin',
      });
      await this.repo.save(admin);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Kiểm tra guest
    const guestUser = await this.repo.findOneBy({ username: 'guest' });
    if (!guestUser) {
      const guest = this.repo.create({
        username: 'guest',
        password: 'guest',
        role: 'guest',
      });
      await this.repo.save(guest);
      console.log('Guest user created');
    } else {
      console.log('Guest user already exists');
    }
  }
}
