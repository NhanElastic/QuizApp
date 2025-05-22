import { SubmissionRepository } from '../submisstion.repository';
import { RoleEnum } from '../../common/enums/role.enum';
import { SubmissionEntity } from '../../typeorm/entities/submission.entity';
import { getUserLevel } from '../../common/functions';

const mockSubmissionEntity = {
  id: 's1',
  answer: 'A',
  score: 10,
  quiz: { id: 'q1', level: 1, user: { id: 'teacher1' } },
  user: { id: 'u1', role: RoleEnum.STUDENT },
};

const submissionRepositoryMock = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};
const userRepositoryMock = {
  findOneById: jest.fn(),
};
const quizRepositoryMock = {
  findOneById: jest.fn(),
};

jest.mock('../../common/functions', () => ({
  getUserLevel: jest.fn(),
}));

describe('SubmissionRepository', () => {
  let repo: SubmissionRepository;

  beforeEach(() => {
    repo = new SubmissionRepository(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      quizRepositoryMock as any,
    );
    jest.clearAllMocks();
  });

  const setupMocks = (user: any, quiz: any) => {
    userRepositoryMock.findOneById.mockResolvedValue(user);
    quizRepositoryMock.findOneById.mockResolvedValue(quiz);
  };

  describe('create', () => {
    it('should throw if user not found', async () => {
      setupMocks(null, mockSubmissionEntity.quiz);
      await expect(
        repo.create({ answer: 'A' }, 'u1', 'q1', 10),
      ).rejects.toThrow('User not found');
    });

    it('should throw if quiz not found', async () => {
      setupMocks(mockSubmissionEntity.user, null);
      await expect(
        repo.create({ answer: 'A' }, 'u1', 'q1', 10),
      ).rejects.toThrow('Quiz not found');
    });

    it('should throw if user level is too low', async () => {
      setupMocks(mockSubmissionEntity.user, {
        ...mockSubmissionEntity.quiz,
        level: 3,
      });

      (getUserLevel as jest.Mock).mockReturnValue(1);
      await expect(
        repo.create({ answer: 'A' }, 'u1', 'q1', 10),
      ).rejects.toThrow('You do not have permission to submit this quiz');
    });

    it('should create and save submission', async () => {
      setupMocks(mockSubmissionEntity.user, mockSubmissionEntity.quiz);
      submissionRepositoryMock.create.mockReturnValue(mockSubmissionEntity);
      submissionRepositoryMock.save.mockResolvedValue(mockSubmissionEntity);

      const result = await repo.create({ answer: 'A' }, 'u1', 'q1', 10);
      expect(result).toEqual(mockSubmissionEntity);
      expect(submissionRepositoryMock.create).toHaveBeenCalledWith({
        answer: 'A',
        user: mockSubmissionEntity.user,
        quiz: mockSubmissionEntity.quiz,
        score: 10,
      });
      expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
        mockSubmissionEntity,
      );
    });
  });

  describe('findOneById', () => {
    it('should return submission by id', async () => {
      submissionRepositoryMock.findOne.mockResolvedValue(mockSubmissionEntity);
      const result = await repo.findOneById('s1');
      expect(result).toEqual(mockSubmissionEntity);
      expect(submissionRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 's1' },
      });
    });
  });

  describe('save', () => {
    it('should save submission', async () => {
      submissionRepositoryMock.save.mockResolvedValue(mockSubmissionEntity);
      const result = await repo.save(mockSubmissionEntity as SubmissionEntity);
      expect(result).toEqual(mockSubmissionEntity);
      expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
        mockSubmissionEntity,
      );
    });
  });

  describe('findAllSubmissions', () => {
    it('should throw if user not found', async () => {
      userRepositoryMock.findOneById.mockResolvedValue(null);
      await expect(repo.findAllSubmissions('u1')).rejects.toThrow(
        'User not found',
      );
    });

    it('should find submissions for student', async () => {
      userRepositoryMock.findOneById.mockResolvedValue({
        id: 'u1',
        role: RoleEnum.STUDENT,
      });
      submissionRepositoryMock.find.mockResolvedValue([mockSubmissionEntity]);
      const result = await repo.findAllSubmissions('u1');
      expect(result).toEqual([mockSubmissionEntity]);
      expect(submissionRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: 'u1' } },
        relations: ['quiz', 'user'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should find submissions for teacher', async () => {
      userRepositoryMock.findOneById.mockResolvedValue({
        id: 'u1',
        role: RoleEnum.TEACHER,
      });
      submissionRepositoryMock.find.mockResolvedValue([mockSubmissionEntity]);
      const result = await repo.findAllSubmissions('u1');
      expect(result).toEqual([mockSubmissionEntity]);
      expect(submissionRepositoryMock.find).toHaveBeenCalledWith({
        where: { quiz: { user: { id: 'u1' } } },
        relations: ['quiz', 'user'],
        order: { createdAt: 'DESC' },
      });
    });
  });
});
