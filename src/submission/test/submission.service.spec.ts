import { SubmissionService } from '../submission.service';
import { RoleEnum } from '../../common/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import {
  CreateSubmissionRequestDto,
  SubmissionResponseDto,
} from '../../dtos/submission.dto';

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn((cls, obj) => obj),
  Expose: () => () => {},
  Transform: () => () => {},
  Exclude: () => () => {},
}));

const mockSubmission = {
  id: 's1',
  answer: 'A',
  score: 10,
  quiz: { id: 'q1' },
  user: { id: 'u1' },
};
const mockSubmissions = [mockSubmission];

const submissionRepository = {
  create: jest.fn(),
  findAllSubmissions: jest.fn(),
};
const quizService = {
  getQuizAnswerById: jest.fn(),
};

describe('SubmissionService', () => {
  let service: SubmissionService;

  beforeEach(() => {
    service = new SubmissionService(
      submissionRepository as any,
      quizService as any,
    );
    jest.clearAllMocks();
  });

  describe('calculateScore', () => {
    it('should return 10 for correct answer', async () => {
      quizService.getQuizAnswerById.mockResolvedValue('A');
      const score = await (service as any).calculateScore('q1', 'A');
      expect(score).toBe(10);
      expect(quizService.getQuizAnswerById).toHaveBeenCalledWith(
        'q1',
        RoleEnum.ADMIN,
      );
    });

    it('should return 0 for incorrect answer', async () => {
      quizService.getQuizAnswerById.mockResolvedValue('B');
      const score = await (service as any).calculateScore('q1', 'A');
      expect(score).toBe(0);
    });
  });

  describe('submitQuiz', () => {
    it('should calculate score and create submission', async () => {
      quizService.getQuizAnswerById.mockResolvedValue('A');
      submissionRepository.create.mockResolvedValue(mockSubmission);

      const submissionData: CreateSubmissionRequestDto = { answer: 'A' };
      const result = await service.submitQuiz(submissionData, 'u1', 'q1');
      expect(result).toEqual(mockSubmission);
      expect(submissionRepository.create).toHaveBeenCalledWith(
        submissionData,
        'u1',
        'q1',
        10,
      );
      expect(plainToInstance).toHaveBeenCalledWith(
        SubmissionResponseDto,
        mockSubmission,
        { excludeExtraneousValues: true },
      );
    });
  });

  describe('getAllSubmissions', () => {
    it('should return all submissions for user', async () => {
      submissionRepository.findAllSubmissions.mockResolvedValue(
        mockSubmissions,
      );
      const result = await service.getAllSubmissions('u1');
      expect(result).toEqual(mockSubmissions);
      expect(submissionRepository.findAllSubmissions).toHaveBeenCalledWith(
        'u1',
      );
      expect(plainToInstance).toHaveBeenCalledWith(
        SubmissionResponseDto,
        mockSubmissions,
        { excludeExtraneousValues: true },
      );
    });
  });
});
