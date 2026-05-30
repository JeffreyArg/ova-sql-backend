import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseOrmEntity } from './exercise.orm-entity';

@Entity('exercise_tables')
export class ExerciseTableOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ExerciseOrmEntity, (e) => e.exercise_tables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: ExerciseOrmEntity;

  @Column({ name: 'table_name', length: 100 })
  tableName: string;

  @Column({ name: 'create_statement', type: 'text' })
  createStatement: string;

  @Column({ name: 'insert_statement', type: 'text' })
  insertStatement: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;
}
