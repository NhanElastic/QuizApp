import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Base } from './base.entity';

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
  user: UserEntity;
}
