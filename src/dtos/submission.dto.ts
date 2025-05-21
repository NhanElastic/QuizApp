import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { QuizEntity } from '../typeorm/entities/quiz.entity';
import { UserEntity } from '../typeorm/entities/user.entity';

abstract class SubmissionDto {
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateSubmissionRequestDto extends SubmissionDto {}

export class SubmissionResponseDto extends SubmissionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  quizId: QuizEntity['id'];

  @IsString()
  @IsNotEmpty()
  userId: UserEntity['id'];

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @Exclude()
  quiz: QuizEntity;

  @Exclude()
  user: UserEntity;
}
