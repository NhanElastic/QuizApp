import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../typeorm/entities/user.entity';

abstract class QuizDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  level!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  question!: string;
}

export class CreateQuizRequestDto extends QuizDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  answer!: string;
}

export class QuizResponseDto extends QuizDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Exclude()
  answer!: string;

  @Exclude()
  user!: UserEntity;
}

export class UpdateQuizRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsNumber()
  level?: number;
}
