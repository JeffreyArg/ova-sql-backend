import { Exercise, ExerciseTable } from '../../domain/entities/exercise';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';

export interface ExerciseTableDto {
  id: string;
  tableName: string;
  createStatement: string;
  insertStatement: string;
  displayOrder: number;
}

export interface ExerciseSummaryDto {
  id: string;
  title: string;
  difficulty: Difficulty;
}

export interface ExerciseDetailDto {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  hint: string | null;
  orderMatters: boolean;
  tables: ExerciseTableDto[];
}

export function toSummaryDto(exercise: Exercise): ExerciseSummaryDto {
  return { id: exercise.id, title: exercise.title, difficulty: exercise.difficulty };
}

export function toDetailDto(exercise: Exercise): ExerciseDetailDto {
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    difficulty: exercise.difficulty,
    hint: exercise.hint,
    orderMatters: exercise.orderMatters,
    tables: exercise.tables.map((t: ExerciseTable) => ({
      id: t.id,
      tableName: t.tableName,
      createStatement: t.createStatement,
      insertStatement: t.insertStatement,
      displayOrder: t.displayOrder,
    })),
  };
}
