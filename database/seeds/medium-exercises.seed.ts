import { ExerciseSeed } from './easy-exercises.seed';

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

const departmentsCreate = `
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)`;

const departmentsInsert = `
INSERT INTO departments (id, name) VALUES
  (1, 'Engineering'),
  (2, 'Marketing'),
  (3, 'Sales')`;

const employeesTable = { tableName: 'employees', createStatement: employeesCreate, insertStatement: employeesInsert, displayOrder: 0 };
const departmentsTable = { tableName: 'departments', createStatement: departmentsCreate, insertStatement: departmentsInsert, displayOrder: 1 };

export const mediumExercises: ExerciseSeed[] = [
  {
    title: 'JOIN entre empleados y departamentos',
    description: 'Muestra el nombre de cada empleado junto con el nombre de su departamento. Usa un INNER JOIN.',
    difficulty: 'medium',
    expectedQuery: `SELECT e.name, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id`,
    hint: 'Usa INNER JOIN ... ON para unir las tablas por el campo en común.',
    orderMatters: false,
    tables: [employeesTable, departmentsTable],
  },
  {
    title: 'Cuenta empleados por departamento',
    description: 'Muestra el nombre de cada departamento y cuántos empleados tiene. Incluye departamentos sin empleados.',
    difficulty: 'medium',
    expectedQuery: `SELECT d.name, COUNT(e.id) AS total_employees FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY d.name`,
    hint: 'Usa LEFT JOIN para incluir todos los departamentos, GROUP BY para agrupar, y COUNT() para contar.',
    orderMatters: true,
    tables: [employeesTable, departmentsTable],
  },
  {
    title: 'HAVING con promedio de salario',
    description: 'Muestra los departamentos cuyo salario promedio de empleados supera los 3500.',
    difficulty: 'medium',
    expectedQuery: `SELECT d.name, AVG(e.salary) AS avg_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name HAVING AVG(e.salary) > 3500`,
    hint: 'Usa HAVING después de GROUP BY para filtrar grupos por una función de agregación.',
    orderMatters: false,
    tables: [employeesTable, departmentsTable],
  },
  {
    title: 'Subquery: salario mayor al promedio',
    description: 'Encuentra todos los empleados cuyo salario es mayor al salario promedio de todos los empleados.',
    difficulty: 'medium',
    expectedQuery: `SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)`,
    hint: 'Usa una subquery dentro de WHERE para calcular el promedio dinámicamente.',
    orderMatters: false,
    tables: [employeesTable],
  },
  {
    title: 'DISTINCT con ORDER BY',
    description: 'Lista los identificadores únicos de departamentos presentes en la tabla employees, ordenados de forma ascendente.',
    difficulty: 'medium',
    expectedQuery: `SELECT DISTINCT department_id FROM employees ORDER BY department_id ASC`,
    hint: 'DISTINCT elimina duplicados. Combínalo con ORDER BY para ordenar el resultado.',
    orderMatters: true,
    tables: [employeesTable],
  },
];
