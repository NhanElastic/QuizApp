import { SubmissionController } from '../submission.controller';
import { RoleEnum } from '../../common/enums/role.enum';

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let submissionService: {
    submitQuiz: jest.Mock;
    getAllSubmissions: jest.Mock;
  };

  beforeEach(() => {
    submissionService = {
      submitQuiz: jest.fn(),
      getAllSubmissions: jest.fn(),
    };
    controller = new SubmissionController(submissionService as any);
  });

  describe('submitQuiz', () => {
    it('should call submissionService.submitQuiz with correct params', async () => {
      const quizId = 'q1';
      const submissionData = { answer: 'A' };
      const userData = { id: 'u1', role: RoleEnum.STUDENT };
      const request = { user: userData } as any;
      const expectedResult = { id: 's1' };
      submissionService.submitQuiz.mockResolvedValue(expectedResult);

      const result = await controller.submitQuiz(
        quizId,
        submissionData,
        request,
      );

      expect(submissionService.submitQuiz).toHaveBeenCalledWith(
        submissionData,
        userData.id,
        quizId,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAllSubmissions', () => {
    it('should call submissionService.getAllSubmissions with user id', async () => {
      const userData = { id: 'u1', role: RoleEnum.STUDENT };
      const request = { user: userData } as any;
      const expectedResult = [{ id: 's1' }];
      submissionService.getAllSubmissions.mockResolvedValue(expectedResult);

      const result = await controller.getAllSubmissions(request);

      expect(submissionService.getAllSubmissions).toHaveBeenCalledWith(
        userData.id,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
