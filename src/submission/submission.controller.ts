import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
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
  async submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submissionData: CreateSubmissionRequestDto,
    @Req() request: Request,
  ): Promise<any> {
    const userData: CreateUserDtoResponse = request['user'];
    return await this.submissionService.submitQuiz(
      submissionData,
      userData.id,
      quizId,
    );
  }
}
