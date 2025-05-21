import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { QuizEntity } from '../typeorm/entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuizRequestDto, UpdateQuizRequestDto } from '../dtos/quiz.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    private readonly userRepository: UserRepository,
  ) {}

  async save(quiz: QuizEntity): Promise<QuizEntity> {
    return await this.quizRepository.save(quiz);
  }

  async create(
    quiz: CreateQuizRequestDto,
    userid: string,
  ): Promise<QuizEntity> {
    const user = await this.userRepository.findOneById(userid);
    if (!user) {
      throw new Error('User not found');
    }
    const newQuiz = this.quizRepository.create({
      ...quiz,
      user,
    });
    return await this.save(newQuiz);
  }

  async findOneById(id: string, level: number): Promise<QuizEntity | null> {
    return await this.quizRepository.findOne({
      where: { id: id, level: LessThanOrEqual(level) },
      relations: ['user'],
    });
  }

  async findOneByTitle(
    title: string,
    level: number,
  ): Promise<QuizEntity | null> {
    return await this.quizRepository.findOne({
      where: { title: title, level: LessThanOrEqual(level) },
    });
  }

  async findAllQuiz(level: number): Promise<QuizEntity[]> {
    return await this.quizRepository.findBy({
      level: LessThanOrEqual(level),
    });
  }

  async deleteQuiz(quiz: QuizEntity): Promise<void> {
    await this.quizRepository.remove(quiz);
  }

  async updateQuiz(
    quiz: QuizEntity,
    newData: UpdateQuizRequestDto,
  ): Promise<QuizEntity> {
    quiz.title = newData.title == null ? quiz.title : newData.title;
    quiz.description =
      newData.description == null ? quiz.description : newData.description;
    quiz.level = newData.level == null ? quiz.level : newData.level;
    quiz.question = newData.question == null ? quiz.question : newData.question;
    quiz.answer = newData.answer == null ? quiz.answer : newData.answer;
    return await this.save(quiz);
  }
}
