import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepositoryPort } from '../../../exercises/domain/ports/exercise.repository.port';
import { SqlExecutorPort } from '../../domain/ports/sql-executor.port';
import { EvaluateSqlRequestDto } from '../dtos/evaluate-sql.request.dto';
import { EvaluateSqlResponseDto, toResponseDto } from '../dtos/evaluate-sql.response.dto';

@Injectable()
export class EvaluateSqlUseCase {
  constructor(
    private readonly exerciseRepo: ExerciseRepositoryPort,
    private readonly sqlExecutor: SqlExecutorPort,
  ) {}

  async execute(dto: EvaluateSqlRequestDto): Promise<EvaluateSqlResponseDto> {
    const exercise = await this.exerciseRepo.findById(dto.exerciseId);
    if (!exercise) throw new NotFoundException(`Exercise ${dto.exerciseId} not found`);

    const result = await this.sqlExecutor.execute(
      exercise.tables,
      dto.userQuery,
      exercise.expectedQuery,
      exercise.orderMatters,
    );

    return toResponseDto(result);
  }
}
