import { Difficulty } from '../value-objects/difficulty.vo';

export interface ExerciseTable {
  id: string;
  tableName: string;
  createStatement: string;
  insertStatement: string;
  displayOrder: number;
}

export class Exercise {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly difficulty: Difficulty,
    public readonly expectedQuery: string,
    public readonly hint: string | null,
    public readonly orderMatters: boolean,
    public readonly tables: ExerciseTable[],
    public readonly createdAt: Date,
  ) {}
}
