import { Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submisstion.repository';
import {
  CreateSubmissionRequestDto,
  SubmissionResponseDto,
} from '../dtos/submission.dto';
import { plainToInstance } from 'class-transformer';
import { QuizService } from '../quiz/quiz.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly quizService: QuizService,
  ) {}

  async calculateScore(quizId: string, answer: string): Promise<number> {
    const correctAnswer = await this.quizService.getQuizAnswerById(quizId);
    return correctAnswer == answer ? 10 : 0;
  }

  async submitQuiz(
    submissionData: CreateSubmissionRequestDto,
    userId: string,
    quizId: string,
  ): Promise<any> {
    const score = await this.calculateScore(quizId, submissionData.answer);
    const submission = await this.submissionRepository.create(
      submissionData,
      userId,
      quizId,
      score,
    );
    return plainToInstance(SubmissionResponseDto, submission);
  }
}
