import { Injectable } from '@nestjs/common';
import { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { ExerciseSummaryDto, toSummaryDto } from '../dtos/exercise.dto';

@Injectable()
export class ListExercisesByDifficultyUseCase {
  constructor(private readonly repo: ExerciseRepositoryPort) {}

  async execute(difficulty?: Difficulty): Promise<ExerciseSummaryDto[]> {
    const exercises = await this.repo.findAll({ difficulty });
    return exercises.map(toSummaryDto);
  }
}
