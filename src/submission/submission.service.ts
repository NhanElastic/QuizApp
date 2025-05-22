import { HttpException, Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submisstion.repository';
import {
  CreateSubmissionRequestDto,
  SubmissionResponseDto,
} from '../dtos/submission.dto';
import { plainToInstance } from 'class-transformer';
import { QuizService } from '../quiz/quiz.service';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly quizService: QuizService,
  ) {}

  private async calculateScore(
    quizId: string,
    answer: string,
  ): Promise<number> {
    try {
      const correctAnswer = await this.quizService.getQuizAnswerById(
        quizId,
        RoleEnum.ADMIN,
      );
      return correctAnswer == answer ? 10 : 0;
    } catch {
      throw new HttpException('Quiz not found', 404);
    }
  }

  async submitQuiz(
    submissionData: CreateSubmissionRequestDto,
    userId: string,
    quizId: string,
  ): Promise<SubmissionResponseDto> {
    const score = await this.calculateScore(quizId, submissionData.answer);
    const submission = await this.submissionRepository.create(
      submissionData,
      userId,
      quizId,
      score,
    );
    return plainToInstance(SubmissionResponseDto, submission, {
      excludeExtraneousValues: true,
    });
  }

  async getAllSubmissions(userId: string): Promise<SubmissionResponseDto[]> {
    const submissions =
      await this.submissionRepository.findAllSubmissions(userId);
    return plainToInstance(SubmissionResponseDto, submissions, {
      excludeExtraneousValues: true,
    });
  }
}
