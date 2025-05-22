import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmissionEntity } from '../typeorm/entities/submission.entity';
import { Repository } from 'typeorm';
import { CreateSubmissionRequestDto } from '../dtos/submission.dto';
import { UserRepository } from '../user/user.repository';
import { QuizRepository } from '../quiz/quiz.repository';
import { getUserLevel } from '../common/funtions';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class SubmissionRepository {
  constructor(
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
    private readonly userRepository: UserRepository,
    private readonly quizRepository: QuizRepository,
  ) {}

  async create(
    submission: CreateSubmissionRequestDto,
    userId: string,
    quizId: string,
    score: number,
  ): Promise<SubmissionEntity> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const quiz = await this.quizRepository.findOneById(quizId, 3);
    if (!quiz) {
      throw new HttpException('Quiz not found', 404);
    }
    const userLevel = getUserLevel(user.role);
    if (userLevel < quiz.level) {
      throw new HttpException(
        'You do not have permission to submit this quiz',
        403,
      );
    }
    const newSubmission = this.submissionRepository.create({
      ...submission,
      user,
      quiz,
      score,
    });
    return this.save(newSubmission);
  }

  async findOneById(id: string): Promise<SubmissionEntity | null> {
    return this.submissionRepository.findOne({
      where: { id },
    });
  }

  async save(submission: SubmissionEntity): Promise<SubmissionEntity> {
    return this.submissionRepository.save(submission);
  }

  async findAllSubmissions(userId: string): Promise<SubmissionEntity[]> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (user.role === RoleEnum.STUDENT) {
      return this.submissionRepository.find({
        where: { user: { id: userId } },
        relations: ['quiz', 'user'],
        order: { createdAt: 'DESC' },
      });
    }

    if (user.role === RoleEnum.TEACHER) {
      return this.submissionRepository.find({
        where: { quiz: { user: { id: userId } } },
        relations: ['quiz', 'user'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.submissionRepository.find({
      relations: ['quiz', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
}
