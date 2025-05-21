import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SubmissionEntity } from './submission.entity';
import { QuizEntity } from './quiz.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { Base } from './base.entity';
import * as bcrypt from 'bcrypt';
@Entity({
  name: 'users',
})
export class UserEntity extends Base {
  @Column({ unique: true, length: 30, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role: RoleEnum;

  @OneToMany(() => SubmissionEntity, (submission) => submission.user)
  submissions: SubmissionEntity[];

  @OneToMany(() => QuizEntity, (quiz) => quiz.user)
  quiz: QuizEntity;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async updatePassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
