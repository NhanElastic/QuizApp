import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

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
  @Transform(({ obj }: { obj: any }): string | undefined => obj.quiz?.id)
  quizId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }: { obj: any }): string | undefined => obj.user?.id)
  userId: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
