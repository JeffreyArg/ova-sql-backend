import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../data-source';
import { easyExercises, ExerciseSeed } from './easy-exercises.seed';
import { mediumExercises } from './medium-exercises.seed';
import { hardExercises } from './hard-exercises.seed';

async function runSeeds(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Database connected.');

  await AppDataSource.query('DELETE FROM exercise_tables');
  await AppDataSource.query('DELETE FROM exercises');
  console.log('Existing data cleared.');

  const allExercises: ExerciseSeed[] = [...easyExercises, ...mediumExercises, ...hardExercises];

  for (const seed of allExercises) {
    const [exercise] = await AppDataSource.query(
      `INSERT INTO exercises (title, description, difficulty, expected_query, hint, order_matters)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [seed.title, seed.description, seed.difficulty, seed.expectedQuery, seed.hint, seed.orderMatters],
    );

    for (const table of seed.tables) {
      await AppDataSource.query(
        `INSERT INTO exercise_tables (exercise_id, table_name, create_statement, insert_statement, display_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [exercise.id, table.tableName, table.createStatement, table.insertStatement, table.displayOrder],
      );
    }

    console.log(`  Seeded: [${seed.difficulty}] ${seed.title}`);
  }

  console.log(`\nDone. ${allExercises.length} exercises seeded.`);
  await AppDataSource.destroy();
}

runSeeds().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
