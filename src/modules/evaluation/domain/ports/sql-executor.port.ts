import { ExerciseTable } from '../../../exercises/domain/entities/exercise';
import { EvaluationResult } from '../value-objects/evaluation-result.vo';

export abstract class SqlExecutorPort {
  abstract execute(
    tables: ExerciseTable[],
    userQuery: string,
    expectedQuery: string,
    orderMatters: boolean,
  ): Promise<EvaluationResult>;
}
