import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDtoResponse } from '../dtos/user.dto';
import {
  CreateSubmissionRequestDto,
  SubmissionResponseDto,
} from '../dtos/submission.dto';
import { SubmissionService } from './submission.service';

import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(AuthGuard(RoleEnum.STUDENT))
  @Post(':quizId')
  submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submissionData: CreateSubmissionRequestDto,
    @Req() request: Request,
  ): Promise<SubmissionResponseDto> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.submissionService.submitQuiz(
      submissionData,
      userData.id,
      quizId,
    );
  }

  @UseGuards(AuthGuard(RoleEnum.STUDENT, RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Get()
  getAllSubmissions(@Req() request: Request): Promise<SubmissionResponseDto[]> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.submissionService.getAllSubmissions(userData.id);
  }
}
