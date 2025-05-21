import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { Base } from './base.entity';
import { QuizEntity } from './quiz.entity';

@Entity({
  name: 'submission',
})
export class SubmissionEntity extends Base {
  @Column('text')
  answer: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  quiz: QuizEntity;
}
