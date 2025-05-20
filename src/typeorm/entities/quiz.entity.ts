import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Base } from './base.entity';

@Entity({
  name: 'quiz',
})
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

  @OneToOne(() => UserEntity, (user) => user.quiz, { onDelete: 'CASCADE' })
  user: UserEntity;
}
