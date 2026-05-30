import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import { ExerciseDetailDto, toDetailDto } from '../dtos/exercise.dto';

@Injectable()
export class GetExerciseByIdUseCase {
  constructor(private readonly repo: ExerciseRepositoryPort) {}

  async execute(id: string): Promise<ExerciseDetailDto> {
    const exercise = await this.repo.findById(id);
    if (!exercise) throw new NotFoundException(`Exercise ${id} not found`);
    return toDetailDto(exercise);
  }
}
