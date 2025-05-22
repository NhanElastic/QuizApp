import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

abstract class SubmissionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateSubmissionRequestDto extends SubmissionDto {}

export class SubmissionResponseDto extends SubmissionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.quiz?.id)
  quizId: string;

  @Expose()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.user?.id)
  userId: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
