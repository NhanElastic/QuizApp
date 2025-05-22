import { QuizRepository } from '../quiz.repository';
import { Repository } from 'typeorm';
import { QuizEntity } from '../../typeorm/entities/quiz.entity';
import { UserRepository } from '../../user/user.repository';
import {
  CreateQuizRequestDto,
  UpdateQuizRequestDto,
} from '../../dtos/quiz.dto';

const mockUserEntity = {
  id: 'user1',
  username: 'testuser',
  password: 'pass',
  role: 'USER',
  submissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQuizEntity = {
  id: '1',
  title: 'Quiz',
  description: 'Desc',
  level: 1,
  question: 'Q?',
  answer: 'A',
  user: mockUserEntity,
};

describe('QuizRepository', () => {
  let quizRepository: QuizRepository;
  let quizRepoMock: jest.Mocked<Repository<QuizEntity>>;
  let userRepoMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    quizRepoMock = {
      save: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      findBy: jest.fn(),
      remove: jest.fn(),
    } as any;
    userRepoMock = {
      findOneById: jest.fn(),
    } as any;
    quizRepository = new QuizRepository(quizRepoMock, userRepoMock);
  });

  it('save should call quizRepository.save', async () => {
    quizRepoMock.save.mockResolvedValue(mockQuizEntity as any);
    const result = await quizRepository.save(mockQuizEntity as any);
    expect(quizRepoMock.save).toHaveBeenCalledWith(mockQuizEntity);
    expect(result).toBe(mockQuizEntity);
  });

  describe('create', () => {
    it('should create and save quiz if user exists', async () => {
      userRepoMock.findOneById.mockResolvedValue(mockUserEntity as any);
      quizRepoMock.create.mockReturnValue(mockQuizEntity as any);
      quizRepoMock.save.mockResolvedValue(mockQuizEntity as any);

      const dto: CreateQuizRequestDto = {
        title: 'Quiz',
        description: 'Desc',
        level: 1,
        question: 'Q?',
        answer: 'A',
      };
      const result = await quizRepository.create(dto, 'user1');
      expect(userRepoMock.findOneById).toHaveBeenCalledWith('user1');
      expect(quizRepoMock.create).toHaveBeenCalledWith({
        ...dto,
        user: mockUserEntity,
      });
      expect(result).toBe(mockQuizEntity);
    });

    it('should throw error if user not found', async () => {
      userRepoMock.findOneById.mockResolvedValue(null);
      await expect(quizRepository.create({} as any, 'user1')).rejects.toThrow(
        'User not found',
      );
    });
  });

  it('findOneById should call findOne with correct params', async () => {
    quizRepoMock.findOne.mockResolvedValue(mockQuizEntity as any);
    const result = await quizRepository.findOneById('1', 2);
    expect(quizRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '1', level: expect.anything() },
      relations: ['user'],
    });
    expect(result).toBe(mockQuizEntity);
  });

  it('findOneByTitle should call findOne with correct params', async () => {
    quizRepoMock.findOne.mockResolvedValue(mockQuizEntity as any);
    const result = await quizRepository.findOneByTitle('Quiz', 2);
    expect(quizRepoMock.findOne).toHaveBeenCalledWith({
      where: { title: 'Quiz', level: expect.anything() },
    });
    expect(result).toBe(mockQuizEntity);
  });

  it('findAllQuiz should call findBy with correct params', async () => {
    quizRepoMock.findBy.mockResolvedValue([mockQuizEntity] as any);
    const result = await quizRepository.findAllQuiz(2);
    expect(quizRepoMock.findBy).toHaveBeenCalledWith({
      level: expect.anything(),
    });
    expect(result).toEqual([mockQuizEntity]);
  });

  it('deleteQuiz should call remove', async () => {
    quizRepoMock.remove.mockResolvedValue(mockQuizEntity as any);
    await quizRepository.deleteQuiz(mockQuizEntity as any);
    expect(quizRepoMock.remove).toHaveBeenCalledWith(mockQuizEntity);
  });

  it('updateQuiz should update fields and save', async () => {
    const quiz = { ...mockQuizEntity };
    const newData: UpdateQuizRequestDto = {
      title: 'New Title',
      description: null,
      question: 'New Q',
      answer: null,
      level: 2,
    };
    quizRepoMock.save.mockResolvedValue({ ...quiz, ...newData } as any);

    const result = await quizRepository.updateQuiz(quiz as any, newData);
    expect(result.title).toBe('New Title');
    expect(result.question).toBe('New Q');
    expect(result.level).toBe(2);
    expect(quizRepoMock.save).toHaveBeenCalled();
  });

  it('updateQuiz should not update any fields if newData is all undefined', async () => {
    const quiz = { ...mockQuizEntity };
    const newData: UpdateQuizRequestDto = {
      title: null,
      description: null,
      question: null,
      answer: null,
      level: null,
    };
    quizRepoMock.save.mockResolvedValue(quiz as any);

    const result = await quizRepository.updateQuiz(quiz as any, newData);
    expect(result.title).toBe(mockQuizEntity.title);
    expect(result.description).toBe(mockQuizEntity.description);
    expect(result.question).toBe(mockQuizEntity.question);
    expect(result.answer).toBe(mockQuizEntity.answer);
    expect(result.level).toBe(mockQuizEntity.level);
    expect(quizRepoMock.save).toHaveBeenCalled();
  });
});
