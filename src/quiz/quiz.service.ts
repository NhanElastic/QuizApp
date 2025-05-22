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
import { getUserLevel } from '../common/funtions';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly userService: UserService,
  ) {}

  async getAllQuizzes(userid: string): Promise<QuizResponseDto[]> {
    const user = await this.userService.findOneById(userid);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const userLevel = getUserLevel(user.role);
    const quizzes = await this.quizRepository.findAllQuiz(userLevel);
    return plainToInstance(QuizResponseDto, quizzes);
  }

  async createQuiz(
    quizData: CreateQuizRequestDto,
    userid: string,
  ): Promise<QuizResponseDto> {
    const user = await this.userService.findOneById(userid);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const result = await this.quizRepository.create(quizData, userid);
    return plainToInstance(QuizResponseDto, result);
  }

  private checkPermission(
    userDto: CreateUserDtoResponse,
    quiz: QuizEntity | QuizResponseDto,
  ): void {
    if (quiz?.user.id !== userDto?.id && userDto?.role === RoleEnum.TEACHER) {
      throw new ForbiddenException(
        "You don't have permission to perform this action on this quiz",
      );
    }
  }

  async deleteQuiz(
    userDto: CreateUserDtoResponse,
    quizId: string,
  ): Promise<void> {
    const userLevel = getUserLevel(userDto.role);
    const quiz = await this.quizRepository.findOneById(quizId, userLevel);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    this.checkPermission(userDto, quiz);
    await this.quizRepository.deleteQuiz(quiz);
  }

  async updateQuiz(
    userDto: CreateUserDtoResponse,
    quizId: string,
    quizData: UpdateQuizRequestDto,
  ): Promise<string | undefined> {
    const userLevel = getUserLevel(userDto.role);
    const quiz = await this.quizRepository.findOneById(quizId, userLevel);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    this.checkPermission(userDto, quiz);
    const quizUpdated = await this.quizRepository.updateQuiz(quiz, quizData);
    return quizUpdated.id;
  }

  async getQuizById(quizId: string, userid: string): Promise<QuizResponseDto> {
    const user = await this.userService.findOneById(userid);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const userLevel = getUserLevel(user.role);
    const quiz = await this.quizRepository.findOneById(quizId, userLevel);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    return plainToInstance(QuizResponseDto, quiz);
  }

  async getQuizAnswerById(quizId: string, userRole: RoleEnum): Promise<string> {
    const userLevel = getUserLevel(userRole);
    const quiz = await this.quizRepository.findOneById(quizId, userLevel);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    return quiz.answer;
  }
}
