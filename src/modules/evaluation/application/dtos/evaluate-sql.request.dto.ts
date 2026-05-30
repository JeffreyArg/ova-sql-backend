import { IsString, IsUUID, MinLength } from 'class-validator';

export class EvaluateSqlRequestDto {
  @IsUUID()
  exerciseId: string;

  @IsString()
  @MinLength(1)
  userQuery: string;
}
