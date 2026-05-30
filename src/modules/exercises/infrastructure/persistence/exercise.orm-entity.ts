import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseTableOrmEntity } from './exercise-table.orm-entity';

@Entity('exercises')
export class ExerciseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['easy', 'medium', 'hard'] })
  difficulty: string;

  @Column({ name: 'expected_query', type: 'text' })
  expectedQuery: string;

  @Column({ type: 'text', nullable: true })
  hint: string | null;

  @Column({ name: 'order_matters', default: false })
  orderMatters: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExerciseTableOrmEntity, (t) => t.exercise)
  exercise_tables: ExerciseTableOrmEntity[];
}
