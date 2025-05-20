import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubmissionEntity } from './submission.entity';
import { QuizEntity } from './quiz.entity';
import { RoleEnum } from '../../app/config/enums/role.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30, nullable: false })
  username: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role: RoleEnum;

  @OneToMany(() => SubmissionEntity, (submission) => submission.user)
  submissions: SubmissionEntity[];

  @OneToOne(() => QuizEntity, (quiz) => quiz.user)
  quiz: QuizEntity;
}
