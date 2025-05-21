import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDtoResponse } from '../dtos/user.dto';
import {
  CreateQuizRequestDto,
  QuizResponseDto,
  UpdateQuizRequestDto,
} from '../dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly authService: AuthService,
  ) {}

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
    const userData: CreateUserDtoResponse = request['user'];
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
  async getQuizById(
    @Param('quizId') quizId: string,
    @Req() request: Request,
  ): Promise<QuizResponseDto> {
    const userData: CreateUserDtoResponse = request['user'];
    return await this.quizService.getQuizById(quizId, userData.id);
  }

  @UseGuards(AuthGuard(RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Post()
  async createQuiz(
    @Req() request: Request,
    @Body() quizData: CreateQuizRequestDto,
  ): Promise<QuizResponseDto> {
    const userData: CreateUserDtoResponse = request['user'];
    return await this.quizService.createQuiz(quizData, userData.id);
  }

  @UseGuards(AuthGuard(RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Delete()
  async deleteQuiz(
    @Req() request: Request,
    @Body('quizId') quizId: string,
  ): Promise<{ message: string; status: string }> {
    const userData: CreateUserDtoResponse = request['user'];
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
    const userData: CreateUserDtoResponse = request['user'];
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
