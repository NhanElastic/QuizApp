import BaseSeed from './base.seed';
import { QuizEntity } from '../entities/quiz.entity';
import { UserEntity } from '../entities/user.entity';

export default class QuizSeed extends BaseSeed {
  constructor() {
    super({
      quizRepo: QuizEntity,
      userRepo: UserEntity,
    });
  }

  public async run(): Promise<void> {
    const teacher = await this.userRepo.findOneBy({ username: 'teacher' });
    if (!teacher) {
      throw new Error('Teacher user not found');
    }
    const checkQuiz1 = await this.quizRepo.findOneBy({
      title: 'Quiz 1',
    });
    const checkQuiz2 = await this.quizRepo.findOneBy({
      title: 'Quiz 2',
    });
    const checkQuiz3 = await this.quizRepo.findOneBy({
      title: 'Quiz 3',
    });
    const checkQuiz4 = await this.quizRepo.findOneBy({
      title: 'Quiz 4',
    });
    const checkQuiz5 = await this.quizRepo.findOneBy({
      title: 'Quiz 5',
    });
    if (checkQuiz1 || checkQuiz2 || checkQuiz3 || checkQuiz4 || checkQuiz5) {
      console.log('Quizzes already exist, skipping seeding.');
      return;
    }
    const quiz1 = this.quizRepo.create({
      title: 'Quiz 1',
      description: 'Description for Quiz 1',
      question: 'Question 1',
      answer: 'Answer 1',
      level: 1,
      user: teacher,
    });
    await this.quizRepo.save(quiz1);
    console.log('Quiz 1 created');

    const quiz2 = this.quizRepo.create({
      title: 'Quiz 2',
      description: 'Description for Quiz 2',
      question: 'Question 2',
      answer: 'Answer 2',
      level: 2,
      user: teacher,
    });
    await this.quizRepo.save(quiz2);
    console.log('Quiz 2 created');

    const quiz3 = this.quizRepo.create({
      title: 'Quiz 3',
      description: 'Description for Quiz 3',
      question: 'Question 3',
      answer: 'Answer 3',
      level: 3,
      user: teacher,
    });
    await this.quizRepo.save(quiz3);
    console.log('Quiz 3 created');
  }
}
