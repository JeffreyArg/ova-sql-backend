import { Exercise } from '../entities/exercise';
import { Difficulty } from '../value-objects/difficulty.vo';

export interface ExerciseFilters {
  difficulty?: Difficulty;
}

export abstract class ExerciseRepositoryPort {
  abstract findAll(filters: ExerciseFilters): Promise<Exercise[]>;
  abstract findById(id: string): Promise<Exercise | null>;
  abstract findRandom(filters: ExerciseFilters): Promise<Exercise | null>;
}
