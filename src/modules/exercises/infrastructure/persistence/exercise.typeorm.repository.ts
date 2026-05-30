import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise, ExerciseTable } from '../../domain/entities/exercise';
import { ExerciseFilters, ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { ExerciseOrmEntity } from './exercise.orm-entity';

@Injectable()
export class ExerciseTypeormRepository extends ExerciseRepositoryPort {
  constructor(
    @InjectRepository(ExerciseOrmEntity)
    private readonly repo: Repository<ExerciseOrmEntity>,
  ) {
    super();
  }

  async findAll(filters: ExerciseFilters): Promise<Exercise[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.exercise_tables', 't');
    if (filters.difficulty) {
      qb.where('e.difficulty = :difficulty', { difficulty: filters.difficulty });
    }
    const entities = await qb.orderBy('e.createdAt', 'ASC').getMany();
    return entities.map(this.toDomain);
  }

  async findById(id: string): Promise<Exercise | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['exercise_tables'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findRandom(filters: ExerciseFilters): Promise<Exercise | null> {
    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.exercise_tables', 't');
    if (filters.difficulty) {
      qb.where('e.difficulty = :difficulty', { difficulty: filters.difficulty });
    }
    qb.orderBy('RANDOM()').limit(1);
    const entity = await qb.getOne();
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: ExerciseOrmEntity): Exercise {
    const tables: ExerciseTable[] = (entity.exercise_tables ?? [])
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((t) => ({
        id: t.id,
        tableName: t.tableName,
        createStatement: t.createStatement,
        insertStatement: t.insertStatement,
        displayOrder: t.displayOrder,
      }));

    return new Exercise(
      entity.id,
      entity.title,
      entity.description,
      entity.difficulty as Difficulty,
      entity.expectedQuery,
      entity.hint,
      entity.orderMatters,
      tables,
      entity.createdAt,
    );
  }
}
