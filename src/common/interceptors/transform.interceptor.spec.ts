import { TransformInterceptor } from './transform.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  it('should wrap response in { status: "success", data }', (done) => {
    const interceptor = new TransformInterceptor();
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of({ foo: 'bar' }),
    };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({
        status: 'success',
        data: { foo: 'bar' },
      });
      done();
    });
  });
});
