import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Base } from './base.entity';
import { SubmissionEntity } from './submission.entity';

@Entity({
  name: 'quiz',
})
@Check(`"level" >= 0 AND "level" <= 3`)
export class QuizEntity extends Base {
  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  question: string;

  @Column({ type: 'text', nullable: false })
  answer: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @ManyToOne(() => UserEntity, (user) => user.quiz, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => SubmissionEntity, (submission) => submission.quiz)
  submissions: SubmissionEntity[];
}
