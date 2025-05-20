import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'submission',
})
export class SubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  answer: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.submissions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
