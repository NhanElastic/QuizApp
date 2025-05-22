import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Request } from 'express';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDtoResponse } from '../dtos/user.dto';
import {
  CreateQuizRequestDto,
  QuizResponseDto,
  UpdateQuizRequestDto,
} from '../dtos/quiz.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(
    AuthGuard(
      RoleEnum.TEACHER,
      RoleEnum.STUDENT,
      RoleEnum.ADMIN,
      RoleEnum.GUEST,
    ),
  )
  @Get()
  getAllQuizzes(@Req() request: Request): Promise<QuizResponseDto[]> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.quizService.getAllQuizzes(userData.id);
  }

  @UseGuards(
    AuthGuard(
      RoleEnum.TEACHER,
      RoleEnum.STUDENT,
      RoleEnum.ADMIN,
      RoleEnum.GUEST,
    ),
  )
  @Get('/:quizId')
  getQuizById(
    @Param('quizId') quizId: string,
    @Req() request: Request,
  ): Promise<QuizResponseDto> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.quizService.getQuizById(quizId, userData.id);
  }

  @UseGuards(AuthGuard(RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Post()
  createQuiz(
    @Req() request: Request,
    @Body() quizData: CreateQuizRequestDto,
  ): Promise<QuizResponseDto> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.quizService.createQuiz(quizData, userData.id);
  }

  @UseGuards(AuthGuard(RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Delete()
  async deleteQuiz(
    @Req() request: Request,
    @Body('quizId') quizId: string,
  ): Promise<{ message: string; status: string }> {
    const userData = request['user'] as CreateUserDtoResponse;
    await this.quizService.deleteQuiz(userData, quizId);
    return {
      message: `Quiz deleted successfully with ID: ${quizId}`,
      status: 'success',
    };
  }

  @UseGuards(AuthGuard(RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Patch('/:quizId')
  async updateQuiz(
    @Req() request: Request,
    @Param('quizId') quizId: string,
    @Body() quizData: UpdateQuizRequestDto,
  ): Promise<{ message: string; status: string }> {
    const userData = request['user'] as CreateUserDtoResponse;
    const updatedId = await this.quizService.updateQuiz(
      userData,
      quizId,
      quizData,
    );
    return {
      message: `Quiz updated successfully with ID: ${updatedId}`,
      status: 'success',
    };
  }
}
