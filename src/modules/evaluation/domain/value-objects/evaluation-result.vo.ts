export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export class EvaluationResult {
  constructor(
    public readonly correct: boolean,
    public readonly feedback: string,
    public readonly userResult: QueryResult | null,
    public readonly expectedResult: QueryResult | null,
    public readonly executionError: string | null,
  ) {}

  static success(userResult: QueryResult, expectedResult: QueryResult): EvaluationResult {
    return new EvaluationResult(
      true,
      '¡Correcto! Tu query retornó los resultados esperados.',
      userResult,
      expectedResult,
      null,
    );
  }

  static wrongResult(userResult: QueryResult, expectedResult: QueryResult): EvaluationResult {
    return new EvaluationResult(
      false,
      'Tu query se ejecutó pero los resultados no coinciden con los esperados.',
      userResult,
      expectedResult,
      null,
    );
  }

  static executionFailed(error: string): EvaluationResult {
    return new EvaluationResult(false, `Error al ejecutar tu query: ${error}`, null, null, error);
  }
}
