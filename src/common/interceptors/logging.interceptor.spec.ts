import { LoggingInterceptor } from './logging.interceptor';
import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let loggerLogSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log incoming request and outgoing response', (done) => {
    const mockRequest = { method: 'GET', url: '/test' };
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of('response'),
    };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toBe('response');
      expect(loggerLogSpy).toHaveBeenCalledWith('Incoming Request: GET /test');
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^Outgoing Response: GET \/test - \d+ms$/),
      );
      done();
    });
  });
});
