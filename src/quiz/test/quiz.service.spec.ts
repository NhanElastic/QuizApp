import { QuizService } from '../quiz.service';
import { ForbiddenException, HttpException } from '@nestjs/common';
import { RoleEnum } from '../../common/enums/role.enum';
import { getUserLevel } from '../../common/funtions';

const mockQuizRepository = {
  findAllQuiz: jest.fn(),
  create: jest.fn(),
  findOneById: jest.fn(),
  updateQuiz: jest.fn(),
  deleteQuiz: jest.fn(),
};
const mockUserService = {
  findOneById: jest.fn(),
};

const mockUser = { id: 'user1', role: RoleEnum.TEACHER };
const mockQuiz = { id: 'quiz1', user: { id: 'user1' }, answer: '42' };

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QuizService(
      mockQuizRepository as any,
      mockUserService as any,
    );
  });

  describe('getAllQuizzes', () => {
    it('returns quizzes for user with correct level', async () => {
      mockUserService.findOneById.mockResolvedValue(mockUser);
      mockQuizRepository.findAllQuiz.mockResolvedValue([mockQuiz]);
      const result = await service.getAllQuizzes('user1');
      expect(result).toBeDefined();
      expect(mockQuizRepository.findAllQuiz).toHaveBeenCalledWith(
        getUserLevel(mockUser.role),
      );
    });

    it('throws if user not found', async () => {
      mockUserService.findOneById.mockResolvedValue(null);
      await expect(service.getAllQuizzes('user1')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createQuiz', () => {
    it('creates and returns quiz', async () => {
      mockUserService.findOneById.mockResolvedValue(mockUser);
      mockQuizRepository.create.mockResolvedValue(mockQuiz);
      const result = await service.createQuiz({} as any, 'user1');
      expect(result).toBeDefined();
      expect(mockQuizRepository.create).toHaveBeenCalledWith({}, 'user1');
    });

    it('throws if user not found', async () => {
      mockUserService.findOneById.mockResolvedValue(null);
      await expect(service.createQuiz({} as any, 'user1')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteQuiz', () => {
    it('deletes quiz if found and permitted', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(mockQuiz);
      mockQuizRepository.deleteQuiz.mockResolvedValue(undefined);
      await expect(
        service.deleteQuiz(mockUser as any, 'quiz1'),
      ).resolves.toBeUndefined();
      expect(mockQuizRepository.findOneById).toHaveBeenCalledWith(
        'quiz1',
        getUserLevel(mockUser.role),
      );
    });

    it('throws if quiz not found', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(null);
      await expect(
        service.deleteQuiz(mockUser as any, 'quiz1'),
      ).rejects.toThrow(HttpException);
    });

    it('throws if no permission', async () => {
      mockQuizRepository.findOneById.mockResolvedValue({
        ...mockQuiz,
        user: { id: 'other' },
      });
      await expect(
        service.deleteQuiz(mockUser as any, 'quiz1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateQuiz', () => {
    it('updates and returns id', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(mockQuiz);
      mockQuizRepository.updateQuiz.mockResolvedValue(mockQuiz);
      const result = await service.updateQuiz(
        mockUser as any,
        'quiz1',
        {} as any,
      );
      expect(result).toBe('quiz1');
      expect(mockQuizRepository.findOneById).toHaveBeenCalledWith(
        'quiz1',
        getUserLevel(mockUser.role),
      );
    });

    it('throws if quiz not found', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(null);
      await expect(
        service.updateQuiz(mockUser as any, 'quiz1', {} as any),
      ).rejects.toThrow(HttpException);
    });

    it('throws if no permission', async () => {
      mockQuizRepository.findOneById.mockResolvedValue({
        ...mockQuiz,
        user: { id: 'other' },
      });
      await expect(
        service.updateQuiz(mockUser as any, 'quiz1', {} as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getQuizById', () => {
    it('returns quiz if found', async () => {
      mockUserService.findOneById.mockResolvedValue(mockUser);
      mockQuizRepository.findOneById.mockResolvedValue(mockQuiz);
      const result = await service.getQuizById('quiz1', 'user1');
      expect(result).toBeDefined();
      expect(mockQuizRepository.findOneById).toHaveBeenCalledWith(
        'quiz1',
        getUserLevel(mockUser.role),
      );
    });

    it('throws if user not found', async () => {
      mockUserService.findOneById.mockResolvedValue(null);
      await expect(service.getQuizById('quiz1', 'user1')).rejects.toThrow(
        HttpException,
      );
    });

    it('throws if quiz not found', async () => {
      mockUserService.findOneById.mockResolvedValue(mockUser);
      mockQuizRepository.findOneById.mockResolvedValue(null);
      await expect(service.getQuizById('quiz1', 'user1')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getQuizAnswerById', () => {
    it('returns answer if found', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(mockQuiz);
      const result = await service.getQuizAnswerById('quiz1', mockUser.role);
      expect(result).toBe('42');
      expect(mockQuizRepository.findOneById).toHaveBeenCalledWith(
        'quiz1',
        getUserLevel(mockUser.role),
      );
    });

    it('throws if quiz not found', async () => {
      mockQuizRepository.findOneById.mockResolvedValue(null);
      await expect(
        service.getQuizAnswerById('quiz1', mockUser.role),
      ).rejects.toThrow(HttpException);
    });
  });
});
