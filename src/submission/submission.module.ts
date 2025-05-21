import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionEntity } from '../typeorm/entities/submission.entity';

import { UserModule } from '../user/user.module';
import { QuizModule } from '../quiz/quiz.module';
import { SubmissionRepository } from './submisstion.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionEntity]),
    UserModule,
    QuizModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionRepository],
  exports: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
