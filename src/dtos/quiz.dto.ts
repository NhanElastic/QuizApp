import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../typeorm/entities/user.entity';

abstract class QuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  level: number;

  @IsString()
  @IsNotEmpty()
  question: string;
}

export class CreateQuizRequestDto extends QuizDto {
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class QuizResponseDto extends QuizDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Exclude()
  answer: string;

  @Exclude()
  user: UserEntity;
}

export class UpdateQuizRequestDto {
  @IsOptional()
  @IsString()
  title: string | null = null;

  @IsOptional()
  @IsString()
  description: string | null = null;

  @IsOptional()
  @IsString()
  question: string | null = null;

  @IsOptional()
  @IsString()
  answer: string | null = null;

  @IsOptional()
  @IsNumber()
  level: number | null = null;
}
