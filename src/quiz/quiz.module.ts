import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizEntity } from '../typeorm/entities/quiz.entity';
import { QuizRepository } from './quiz.repository';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity]), AuthModule, UserModule],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository],
  exports: [QuizService, QuizRepository],
})
export class QuizModule {}
