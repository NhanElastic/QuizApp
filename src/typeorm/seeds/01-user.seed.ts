import { UserEntity } from '../entities/user.entity';
import BaseSeed from './base.seed';

export default class UserSeed extends BaseSeed {
  constructor() {
    super({
      repo: UserEntity,
    });
  }

  public async run(): Promise<void> {
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

    const teacherUser = await this.repo.findOneBy({ username: 'teacher' });
    if (!teacherUser) {
      const teacher = this.repo.create({
        username: 'teacher',
        password: 'teacher',
        role: 'teacher',
      });
      await this.repo.save(teacher);
      console.log('teacher user created');
    } else {
      console.log('teacher user already exists');
    }

    const teacherUser2 = await this.repo.findOneBy({ username: 'teacher2' });
    if (!teacherUser2) {
      const teacher2 = this.repo.create({
        username: 'teacher2',
        password: 'teacher',
        role: 'teacher',
      });
      await this.repo.save(teacher2);
      console.log('teacher2 user created');
    } else {
      console.log('teacher2 user already exists');
    }

    const studentUser = await this.repo.findOneBy({ username: 'student' });
    if (!studentUser) {
      const student = this.repo.create({
        username: 'student',
        password: 'student',
        role: 'student',
      });
      await this.repo.save(student);
      console.log('student user created');
    } else {
      console.log('student user already exists');
    }
  }
}
