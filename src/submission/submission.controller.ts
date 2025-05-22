import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDtoResponse } from '../dtos/user.dto';
import { CreateSubmissionRequestDto } from '../dtos/submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(AuthGuard(RoleEnum.STUDENT))
  @Post(':quizId')
  submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submissionData: CreateSubmissionRequestDto,
    @Req() request: Request,
  ): Promise<any> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.submissionService.submitQuiz(
      submissionData,
      userData.id,
      quizId,
    );
  }

  @UseGuards(AuthGuard(RoleEnum.STUDENT, RoleEnum.TEACHER, RoleEnum.ADMIN))
  @Get()
  getAllSubmissions(@Req() request: Request): Promise<any> {
    const userData = request['user'] as CreateUserDtoResponse;
    return this.submissionService.getAllSubmissions(userData.id);
  }
}
