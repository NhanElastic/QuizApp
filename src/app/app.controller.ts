import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
