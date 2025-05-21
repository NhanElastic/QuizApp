import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDtoResponse } from '../dtos/user.dto';
import {
  CreateQuizRequestDto,
  QuizResponseDto,
  UpdateQuizRequestDto,
} from '../dtos/quiz.dto';
import { plainToInstance } from 'class-transformer';
import { QuizEntity } from '../typeorm/entities/quiz.entity';
import { UserEntity } from '../typeorm/entities/user.entity';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly userService: UserService,
  ) {}

  private getUserLevelByRole(user: CreateUserDtoResponse): number {
    return user.role === RoleEnum.GUEST ? 2 : 3;
  }

  async getAllQuizzes(userid: string): Promise<QuizResponseDto[]> {
    const user = await this.userService.findOneById(userid);
    const userLevel = this.getUserLevelByRole(user);
    const quizzes = await this.quizRepository.findAllQuiz(userLevel);
    return plainToInstance(QuizResponseDto, quizzes);
  }

  async createQuiz(
    quizData: CreateQuizRequestDto,
    userid: string,
  ): Promise<QuizResponseDto> {
    const result = await this.quizRepository.create(quizData, userid);
    return plainToInstance(QuizResponseDto, result);
  }

  private checkPermission(
    userDto: CreateUserDtoResponse,
    quiz: QuizEntity,
  ): boolean {
    if (quiz?.user.id !== userDto?.id && userDto?.role === RoleEnum.TEACHER) {
      throw new ForbiddenException(
        "You don't have permission to delete this quiz",
      );
    }
    return true;
  }

  async deleteQuiz(
    userDto: CreateUserDtoResponse,
    quizId: string,
  ): Promise<void> {
    const quiz = await this.quizRepository.findOneById(quizId, 3);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    const permission = this.checkPermission(userDto, quiz);
    if (permission) {
      return await this.quizRepository.deleteQuiz(quiz);
    }
  }

  async updateQuiz(
    userDto: CreateUserDtoResponse,
    quizId: string,
    quizData: UpdateQuizRequestDto,
  ): Promise<string | undefined> {
    const quiz = await this.quizRepository.findOneById(quizId, 3);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    const permission = this.checkPermission(userDto, quiz);
    if (permission) {
      const quizUpdated = await this.quizRepository.updateQuiz(quiz, quizData);
      return quizUpdated.id;
    }
  }

  async getQuizById(quizId: string, userid: string): Promise<QuizResponseDto> {
    const user = await this.userService.findOneById(userid);
    const userLevel = this.getUserLevelByRole(user);
    const quiz = await this.quizRepository.findOneById(quizId, userLevel);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    return plainToInstance(QuizResponseDto, quiz);
  }
}
