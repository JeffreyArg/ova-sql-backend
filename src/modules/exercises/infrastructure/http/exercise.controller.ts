import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetExerciseByIdUseCase } from '../../application/use-cases/get-exercise-by-id.use-case';
import { GetRandomExerciseUseCase } from '../../application/use-cases/get-random-exercise.use-case';
import { ListExercisesByDifficultyUseCase } from '../../application/use-cases/list-exercises-by-difficulty.use-case';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(
    private readonly listUseCase: ListExercisesByDifficultyUseCase,
    private readonly getByIdUseCase: GetExerciseByIdUseCase,
    private readonly getRandomUseCase: GetRandomExerciseUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar ejercicios (opcionalmente por dificultad)' })
  @ApiQuery({ name: 'difficulty', enum: Difficulty, required: false })
  list(@Query('difficulty') difficulty?: Difficulty) {
    return this.listUseCase.execute(difficulty);
  }

  @Get('random')
  @ApiOperation({ summary: 'Obtener un ejercicio aleatorio' })
  @ApiQuery({ name: 'difficulty', enum: Difficulty, required: false })
  getRandom(@Query('difficulty') difficulty?: Difficulty) {
    return this.getRandomUseCase.execute(difficulty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ejercicio por su ID' })
  getById(@Param('id') id: string) {
    return this.getByIdUseCase.execute(id);
  }
}
