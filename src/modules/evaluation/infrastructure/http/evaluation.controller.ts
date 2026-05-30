import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EvaluateSqlUseCase } from '../../application/use-cases/evaluate-sql.use-case';
import { EvaluateSqlRequestDto } from '../../application/dtos/evaluate-sql.request.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluateSqlUseCase: EvaluateSqlUseCase) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  evaluate(@Body() dto: EvaluateSqlRequestDto) {
    return this.evaluateSqlUseCase.execute(dto);
  }
}
