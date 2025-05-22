import { QuizController } from '../quiz.controller';
import { CreateUserDtoResponse } from '../../dtos/user.dto';
import { RoleEnum } from '../../common/enums/role.enum';
import {
  CreateQuizRequestDto,
  QuizResponseDto,
  UpdateQuizRequestDto,
} from '../../dtos/quiz.dto';

describe('QuizController', () => {
  let controller: QuizController;
  let quizService: {
    getAllQuizzes: jest.Mock;
    getQuizById: jest.Mock;
    createQuiz: jest.Mock;
    deleteQuiz: jest.Mock;
    updateQuiz: jest.Mock;
  };

  const userData: CreateUserDtoResponse = {
    id: 'u1',
    username: 'test',
    role: RoleEnum.TEACHER,
  } as any;

  beforeEach(() => {
    quizService = {
      getAllQuizzes: jest.fn(),
      getQuizById: jest.fn(),
      createQuiz: jest.fn(),
      deleteQuiz: jest.fn(),
      updateQuiz: jest.fn(),
    };
    controller = new QuizController(quizService as any);
  });

  it('should get all quizzes', async () => {
    const quizzes = [{ id: 'q1' }] as QuizResponseDto[];
    quizService.getAllQuizzes.mockResolvedValue(quizzes);
    const req = { user: userData } as any;
    const result = await controller.getAllQuizzes(req);
    expect(quizService.getAllQuizzes).toHaveBeenCalledWith(userData.id);
    expect(result).toBe(quizzes);
  });

  it('should get quiz by id', async () => {
    const quiz = { id: 'q1' } as QuizResponseDto;
    quizService.getQuizById.mockResolvedValue(quiz);
    const req = { user: userData } as any;
    const result = await controller.getQuizById('q1', req);
    expect(quizService.getQuizById).toHaveBeenCalledWith('q1', userData.id);
    expect(result).toBe(quiz);
  });

  it('should create a quiz', async () => {
    const quizData = { title: 'Quiz' } as CreateQuizRequestDto;
    const quiz = { id: 'q1' } as QuizResponseDto;
    quizService.createQuiz.mockResolvedValue(quiz);
    const req = { user: userData } as any;
    const result = await controller.createQuiz(req, quizData);
    expect(quizService.createQuiz).toHaveBeenCalledWith(quizData, userData.id);
    expect(result).toBe(quiz);
  });

  it('should delete a quiz', async () => {
    quizService.deleteQuiz.mockResolvedValue(undefined);
    const req = { user: userData } as any;
    const result = await controller.deleteQuiz(req, 'q1');
    expect(quizService.deleteQuiz).toHaveBeenCalledWith(userData, 'q1');
    expect(result).toEqual({
      message: 'Quiz deleted successfully with ID: q1',
      status: 'success',
    });
  });

  it('should update a quiz', async () => {
    quizService.updateQuiz.mockResolvedValue('q1');
    const req = { user: userData } as any;
    const quizData = { title: 'Updated' } as UpdateQuizRequestDto;
    const result = await controller.updateQuiz(req, 'q1', quizData);
    expect(quizService.updateQuiz).toHaveBeenCalledWith(
      userData,
      'q1',
      quizData,
    );
    expect(result).toEqual({
      message: 'Quiz updated successfully with ID: q1',
      status: 'success',
    });
  });
});
