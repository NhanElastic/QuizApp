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
  ],
  controllers: [
    AppController,
    UserController,
    QuizController,
    SubmissionController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule {}
