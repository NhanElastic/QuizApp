import BaseSeed from './base.seed';
import { UserEntity } from '../entities/user.entity';
import { QuizEntity } from '../entities/quiz.entity';
import { SubmissionEntity } from '../entities/submission.entity';

export default class SubmissionSeed extends BaseSeed {
  constructor() {
    super({
      userRepository: UserEntity,
      quizRepository: QuizEntity,
      submissionRepository: SubmissionEntity,
    });
  }

  public async run(): Promise<void> {
    const student = await this.userRepository.findOneBy({
      username: 'student',
    });
    const quiz = await this.quizRepository.findOneBy({
      title: 'Quiz 1',
      level: 1,
    });
    if (!student || !quiz) {
      throw new Error('Student or Quiz not found');
    }
    const submission = this.submissionRepository.create({
      answer: 'Answer 1',
      score: 85,
      user: student,
      quiz: quiz,
    });
    await this.submissionRepository.save(submission);
    console.log('Submission created');
    const submission2 = this.submissionRepository.create({
      answer: 'Answer 2',
      score: 90,
      user: student,
      quiz: quiz,
    });
    await this.submissionRepository.save(submission2);
    console.log('Submission created');
    const submission3 = this.submissionRepository.create({
      answer: 'Answer 3',
      score: 95,
      user: student,
      quiz: quiz,
    });
    await this.submissionRepository.save(submission3);
    console.log('Submission created');
  }
}
