import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './config/database.config';
import { UserController } from './user/user.controller';
import { QuizController } from './quiz/quiz.controller';
import { SubmissionController } from './submission/submission.controller';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig)],
  controllers: [
    AppController,
    UserController,
    QuizController,
    SubmissionController,
  ],
  providers: [AppService],
})
export class AppModule {}
