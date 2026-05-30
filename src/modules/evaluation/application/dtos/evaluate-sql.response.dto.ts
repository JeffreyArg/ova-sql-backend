import { EvaluationResult, QueryResult } from '../../domain/value-objects/evaluation-result.vo';

export interface EvaluateSqlResponseDto {
  correct: boolean;
  feedback: string;
  userResult: QueryResult | null;
  expectedResult: QueryResult | null;
  executionError: string | null;
}

export function toResponseDto(result: EvaluationResult): EvaluateSqlResponseDto {
  return {
    correct: result.correct,
    feedback: result.feedback,
    userResult: result.userResult,
    expectedResult: result.expectedResult,
    executionError: result.executionError,
  };
}
