export interface ExerciseSeed {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedQuery: string;
  hint: string | null;
  orderMatters: boolean;
  tables: {
    tableName: string;
    createStatement: string;
    insertStatement: string;
    displayOrder: number;
  }[];
}

const employeesCreate = `
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL
)`;

const employeesInsert = `
INSERT INTO employees (id, name, salary, department_id) VALUES
  (1, 'Ana García', 3500.00, 1),
  (2, 'Luis Martínez', 2800.00, 2),
  (3, 'María López', 4200.00, 1),
  (4, 'Carlos Rodríguez', 3100.00, 3),
  (5, 'Sofia Hernández', 2600.00, 2),
  (6, 'Diego Torres', 5000.00, 1),
  (7, 'Isabella Flores', 3800.00, 3),
  (8, 'Miguel Ramírez', 2900.00, 2)`;

const employeesTable = {
  tableName: 'employees',
  createStatement: employeesCreate,
  insertStatement: employeesInsert,
  displayOrder: 0,
};

export const easyExercises: ExerciseSeed[] = [
  {
    title: 'Selecciona todos los empleados',
    description: 'Escribe una query que retorne todos los registros de la tabla employees.',
    difficulty: 'easy',
    expectedQuery: 'SELECT * FROM employees',
    hint: 'Usa SELECT * para seleccionar todas las columnas.',
    orderMatters: false,
    tables: [employeesTable],
  },
  {
    title: 'Filtra por departamento',
    description: 'Selecciona todos los empleados que pertenecen al departamento con id = 1.',
    difficulty: 'easy',
    expectedQuery: 'SELECT * FROM employees WHERE department_id = 1',
    hint: 'Usa la cláusula WHERE para filtrar por department_id.',
    orderMatters: false,
    tables: [employeesTable],
  },
  {
    title: 'Ordena por salario',
    description: 'Lista todos los empleados ordenados por salario de mayor a menor.',
    difficulty: 'easy',
    expectedQuery: 'SELECT * FROM employees ORDER BY salary DESC',
    hint: 'Usa ORDER BY con DESC para orden descendente.',
    orderMatters: true,
    tables: [employeesTable],
  },
  {
    title: 'Selecciona columnas específicas',
    description: 'Muestra únicamente el nombre y el salario de todos los empleados.',
    difficulty: 'easy',
    expectedQuery: 'SELECT name, salary FROM employees',
    hint: 'Especifica los nombres de las columnas separados por coma en lugar de *.',
    orderMatters: false,
    tables: [employeesTable],
  },
  {
    title: 'Condición compuesta con AND',
    description: 'Encuentra los empleados del departamento 1 con salario mayor a 4000.',
    difficulty: 'easy',
    expectedQuery: 'SELECT * FROM employees WHERE department_id = 1 AND salary > 4000',
    hint: 'Combina dos condiciones con AND en la cláusula WHERE.',
    orderMatters: false,
    tables: [employeesTable],
  },
];
