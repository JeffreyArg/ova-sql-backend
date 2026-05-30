import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { ExerciseDetailDto, toDetailDto } from '../dtos/exercise.dto';

@Injectable()
export class GetRandomExerciseUseCase {
  constructor(private readonly repo: ExerciseRepositoryPort) {}

  async execute(difficulty?: Difficulty): Promise<ExerciseDetailDto> {
    const exercise = await this.repo.findRandom({ difficulty });
    if (!exercise) throw new NotFoundException('No exercises found for the given difficulty');
    return toDetailDto(exercise);
  }
}
