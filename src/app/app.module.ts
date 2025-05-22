import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import databaseConfig from './config/database.config';
import { UserController } from '../user/user.controller';
import { QuizController } from '../quiz/quiz.controller';
import { SubmissionController } from '../submission/submission.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '../auth/auth.controller';
import { QuizModule } from '../quiz/quiz.module';
import { SubmissionModule } from '../submission/submission.module';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        if (!dbConfig) {
          throw new Error('Database configuration is not defined');
        }
        return dbConfig;
      },
    }),
    UserModule,
    AuthModule,
    QuizModule,
    SubmissionModule,
  ],
  controllers: [
    AppController,
    UserController,
    QuizController,
    AuthController,
    SubmissionController,
  ],
  providers: [
    AppService,
    TransformInterceptor,
    LoggingInterceptor,
    HttpExceptionFilter,
  ],
})
export class AppModule {}
