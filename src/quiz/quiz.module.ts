import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizEntity } from '../typeorm/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity])],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class SubmissionModule {}
