import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseRepositoryPort } from './domain/ports/exercise.repository.port';
import { ExerciseOrmEntity } from './infrastructure/persistence/exercise.orm-entity';
import { ExerciseTableOrmEntity } from './infrastructure/persistence/exercise-table.orm-entity';
import { ExerciseTypeormRepository } from './infrastructure/persistence/exercise.typeorm.repository';
import { ListExercisesByDifficultyUseCase } from './application/use-cases/list-exercises-by-difficulty.use-case';
import { GetExerciseByIdUseCase } from './application/use-cases/get-exercise-by-id.use-case';
import { GetRandomExerciseUseCase } from './application/use-cases/get-random-exercise.use-case';
import { ExerciseController } from './infrastructure/http/exercise.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseOrmEntity, ExerciseTableOrmEntity])],
  controllers: [ExerciseController],
  providers: [
    { provide: ExerciseRepositoryPort, useClass: ExerciseTypeormRepository },
    ListExercisesByDifficultyUseCase,
    GetExerciseByIdUseCase,
    GetRandomExerciseUseCase,
  ],
  exports: [ExerciseRepositoryPort],
})
export class ExercisesModule {}
