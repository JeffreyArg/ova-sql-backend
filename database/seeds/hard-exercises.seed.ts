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

const productsCreate = `
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
)`;
const productsInsert = `
INSERT INTO products (id, name, price) VALUES
  (1, 'Laptop', 1200.00),
  (2, 'Mouse', 25.00),
  (3, 'Keyboard', 75.00),
  (4, 'Monitor', 350.00),
  (5, 'Headset', 80.00)`;

const salesCreate = `
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  employee_id INT NOT NULL,
  quantity INT NOT NULL,
  sale_date DATE NOT NULL
)`;
const salesInsert = `
INSERT INTO sales (id, product_id, employee_id, quantity, sale_date) VALUES
  (1, 1, 1, 2, '2024-01-10'),
  (2, 2, 2, 5, '2024-01-15'),
  (3, 3, 1, 3, '2024-01-20'),
  (4, 4, 3, 1, '2024-02-05'),
  (5, 1, 4, 1, '2024-02-10'),
  (6, 5, 2, 4, '2024-02-15'),
  (7, 2, 5, 10, '2024-03-01'),
  (8, 3, 6, 2, '2024-03-05'),
  (9, 4, 1, 3, '2024-03-10'),
  (10, 1, 3, 2, '2024-03-15')`;

const employeesTable = { tableName: 'employees', createStatement: employeesCreate, insertStatement: employeesInsert, displayOrder: 0 };
const departmentsTable = { tableName: 'departments', createStatement: departmentsCreate, insertStatement: departmentsInsert, displayOrder: 1 };
const productsTable = { tableName: 'products', createStatement: productsCreate, insertStatement: productsInsert, displayOrder: 2 };
const salesTable = { tableName: 'sales', createStatement: salesCreate, insertStatement: salesInsert, displayOrder: 3 };

export const hardExercises: ExerciseSeed[] = [
  {
    title: 'CTE: ventas totales por empleado',
    description: 'Usa una CTE (WITH) para calcular la cantidad total de unidades vendidas por cada empleado y muestra su nombre junto con ese total, ordenado de mayor a menor.',
    difficulty: 'hard',
    expectedQuery: `WITH employee_sales AS (
  SELECT employee_id, SUM(quantity) AS total_sold
  FROM sales
  GROUP BY employee_id
)
SELECT e.name, es.total_sold
FROM employees e
JOIN employee_sales es ON e.id = es.employee_id
ORDER BY es.total_sold DESC`,
    hint: 'Define la CTE con WITH nombre AS (...) y luego úsala como si fuera una tabla en el SELECT principal.',
    orderMatters: true,
    tables: [employeesTable, salesTable],
  },
  {
    title: 'Window function: ranking por departamento',
    description: 'Asigna un número de ranking a cada empleado dentro de su departamento basado en su salario (de mayor a menor). Muestra nombre, salario, department_id y el ranking.',
    difficulty: 'hard',
    expectedQuery: `SELECT name, salary, department_id, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank FROM employees ORDER BY department_id, rank`,
    hint: 'Usa ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) para asignar rankings dentro de grupos.',
    orderMatters: true,
    tables: [employeesTable],
  },
  {
    title: 'Subquery correlacionada: productos distintos por empleado',
    description: 'Para cada empleado, muestra su nombre y el número de productos distintos que ha vendido usando una subquery correlacionada.',
    difficulty: 'hard',
    expectedQuery: `SELECT e.name, (SELECT COUNT(DISTINCT s.product_id) FROM sales s WHERE s.employee_id = e.id) AS distinct_products FROM employees e ORDER BY e.name`,
    hint: 'Una subquery correlacionada referencia columnas de la query exterior (e.id). Se ejecuta una vez por cada fila del resultado exterior.',
    orderMatters: true,
    tables: [employeesTable, salesTable],
  },
  {
    title: 'JOIN múltiple con agregación',
    description: 'Muestra el nombre del empleado, su departamento, el nombre del producto vendido y la cantidad, para todas las ventas registradas. Ordena por nombre de empleado y luego por fecha de venta.',
    difficulty: 'hard',
    expectedQuery: `SELECT e.name AS employee, d.name AS department, p.name AS product, s.quantity FROM sales s JOIN employees e ON s.employee_id = e.id JOIN departments d ON e.department_id = d.id JOIN products p ON s.product_id = p.id ORDER BY e.name, s.sale_date`,
    hint: 'Encadena múltiples JOINs. Cada JOIN agrega una tabla al resultado usando su clave de relación.',
    orderMatters: true,
    tables: [employeesTable, departmentsTable, productsTable, salesTable],
  },
  {
    title: 'Agregación con FILTER',
    description: 'Por cada departamento muestra: nombre, total de empleados, cuántos tienen salario mayor a 3500, y cuántos tienen salario menor o igual a 3500. Ordena por nombre de departamento.',
    difficulty: 'hard',
    expectedQuery: `SELECT d.name, COUNT(e.id) AS total, COUNT(e.id) FILTER (WHERE e.salary > 3500) AS high_salary, COUNT(e.id) FILTER (WHERE e.salary <= 3500) AS low_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY d.name`,
    hint: 'La sintaxis FILTER (WHERE condición) permite aplicar condiciones a funciones de agregación sin necesidad de CASE WHEN.',
    orderMatters: true,
    tables: [employeesTable, departmentsTable],
  },
];
