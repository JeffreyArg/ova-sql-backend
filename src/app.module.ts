import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './shared/database/database.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ExercisesModule,
    EvaluationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
