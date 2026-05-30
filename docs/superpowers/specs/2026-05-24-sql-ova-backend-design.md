# SQL OVA Backend — Design Spec
**Date:** 2026-05-24  
**Stack:** NestJS v11 · TypeScript · PostgreSQL · TypeORM  
**Branch:** feature/sql-application

---

## 1. Contexto y objetivo

Aplicación web para practicar sintaxis SQL con tres niveles de dificultad (easy, medium, hard). El usuario ve un ejercicio con su enunciado y las tablas de datos disponibles, escribe una query SQL y recibe feedback inmediato sobre si es correcta o qué falló.

**Fuera de scope:** autenticación, gestión de usuarios, progreso persistente, roles docente/alumno.

---

## 2. Arquitectura general

**Patrón:** Arquitectura hexagonal por módulo dentro de un monolito NestJS.

Dos módulos de negocio: `exercises` y `evaluation`. Cada uno tiene tres capas:

- **`domain/`** — entidades puras, value objects, puertos (interfaces). Sin dependencias de framework.
- **`application/`** — casos de uso que orquestan el dominio. Sin dependencias de framework.
- **`infrastructure/`** — adaptadores HTTP (controllers), persistencia (TypeORM), sandbox PostgreSQL.

**Regla de dependencia:** `domain` ← `application` ← `infrastructure`. Nunca al revés.

---

## 3. Estructura de carpetas

```
src/
├── modules/
│   ├── exercises/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── exercise.ts
│   │   │   ├── ports/
│   │   │   │   └── exercise.repository.port.ts
│   │   │   └── value-objects/
│   │   │       └── difficulty.vo.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-random-exercise.use-case.ts
│   │   │   │   ├── get-exercise-by-id.use-case.ts
│   │   │   │   └── list-exercises-by-difficulty.use-case.ts
│   │   │   └── dtos/
│   │   │       └── exercise.dto.ts
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── exercise.orm-entity.ts
│   │   │   │   └── exercise.typeorm.repository.ts
│   │   │   └── http/
│   │   │       └── exercise.controller.ts
│   │   └── exercises.module.ts
│   │
│   └── evaluation/
│       ├── domain/
│       │   ├── ports/
│       │   │   └── sql-executor.port.ts
│       │   └── value-objects/
│       │       └── evaluation-result.vo.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   └── evaluate-sql.use-case.ts
│       │   └── dtos/
│       │       ├── evaluate-sql.request.dto.ts
│       │       └── evaluate-sql.response.dto.ts
│       ├── infrastructure/
│       │   ├── sandbox/
│       │   │   └── postgres-sandbox.adapter.ts
│       │   └── http/
│       │       └── evaluation.controller.ts
│       └── evaluation.module.ts
│
├── shared/
│   └── database/
│       └── database.module.ts
├── app.module.ts
└── main.ts

database/
├── migrations/
│   ├── 001-create-exercises-table.migration.ts
│   ├── 002-create-exercise-tables-table.migration.ts
│   └── 003-create-sandbox-role.migration.ts
├── seeds/
│   ├── seed.runner.ts
│   ├── easy-exercises.seed.ts
│   ├── medium-exercises.seed.ts
│   └── hard-exercises.seed.ts
└── data-source.ts
```

---

## 4. Modelo de datos

### Tabla `exercises`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | gen_random_uuid() |
| `title` | VARCHAR(255) | |
| `description` | TEXT | Enunciado del ejercicio |
| `difficulty` | ENUM('easy','medium','hard') | |
| `expected_query` | TEXT | Query correcta de referencia |
| `hint` | TEXT | Nullable |
| `order_matters` | BOOLEAN | Default false. Si true, el ORDER BY del resultado importa |
| `created_at` | TIMESTAMP | Default NOW() |

### Tabla `exercise_tables`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `exercise_id` | UUID FK → exercises | ON DELETE CASCADE |
| `table_name` | VARCHAR(100) | Ej: "employees" |
| `create_statement` | TEXT | SQL para crear la tabla en el sandbox |
| `insert_statement` | TEXT | SQL para poblar la tabla en el sandbox |
| `display_order` | INT | Default 0. Orden de visualización al usuario |

---

## 5. Endpoints

**Prefijo global:** `/api/v1`

### Exercises

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/exercises` | Lista ejercicios (id, title, difficulty). `?difficulty` opcional; si se omite retorna todos los niveles |
| `GET` | `/exercises/random` | Ejercicio aleatorio. `?difficulty` opcional; si se omite elige de cualquier nivel |
| `GET` | `/exercises/:id` | Ejercicio completo con sus tablas. **Nunca expone `expected_query`** |

### Evaluation

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/evaluation` | Evalúa la query SQL del usuario |

**Request body:**
```json
{
  "exerciseId": "uuid",
  "userQuery": "SELECT * FROM employees WHERE salary > 3000"
}
```

**Response — query correcta:**
```json
{
  "correct": true,
  "feedback": "¡Correcto! Tu query retornó los resultados esperados.",
  "userResult": { "columns": ["id", "name"], "rows": [[1, "Ana"]] },
  "expectedResult": { "columns": ["id", "name"], "rows": [[1, "Ana"]] },
  "executionError": null
}
```

**Response — error de sintaxis:**
```json
{
  "correct": false,
  "feedback": "Error de sintaxis cerca de 'FORM'. ¿Quisiste escribir FROM?",
  "userResult": null,
  "expectedResult": null,
  "executionError": "syntax error at or near \"FORM\""
}
```

**Response — query ejecuta pero resultado incorrecto:**
```json
{
  "correct": false,
  "feedback": "Tu query se ejecutó pero los resultados no coinciden con los esperados.",
  "userResult": { "columns": ["id", "name"], "rows": [[2, "Luis"]] },
  "expectedResult": { "columns": ["id", "name"], "rows": [[1, "Ana"]] },
  "executionError": null
}
```

### Health

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servidor y conectividad a DB |

---

## 6. Flujo de evaluación (sandbox)

```
POST /evaluation
      │
      ▼
EvaluateSqlUseCase
      │
      ├─ 1. Carga ejercicio por ID (expected_query + exercise_tables)
      │
      ├─ 2. PostgresSandboxAdapter.execute(tables, userQuery, expectedQuery)
      │         │
      │         ├─ Crea schema temporal: sandbox_<uuid>
      │         ├─ SET search_path TO sandbox_<uuid>
      │         ├─ Ejecuta CREATE TABLE + INSERT por cada exercise_table
      │         ├─ Ejecuta expected_query → expectedRows
      │         ├─ Ejecuta userQuery (bajo rol sandbox_user)
      │         │     ├─ Error de sintaxis/runtime → { correct: false, executionError }
      │         │     └─ Éxito → userRows
      │         ├─ Compara userRows vs expectedRows
      │         │     ├─ order_matters=false → compara como sets (sin orden)
      │         │     └─ order_matters=true  → compara orden exacto
      │         └─ DROP SCHEMA sandbox_<uuid> CASCADE (en bloque finally)
      │
      └─ 3. Retorna EvaluationResult al controller
```

### Seguridad del sandbox

Se crea un rol PostgreSQL restringido una sola vez (migración 003):

```sql
CREATE ROLE sandbox_user NOLOGIN;
```

Por cada schema temporal, antes de ejecutar la query del usuario:

```sql
GRANT USAGE ON SCHEMA sandbox_<uuid> TO sandbox_user;
GRANT SELECT ON ALL TABLES IN SCHEMA sandbox_<uuid> TO sandbox_user;
SET ROLE sandbox_user;
-- ejecutar userQuery aquí
RESET ROLE;
```

Esto impide que el usuario ejecute `INSERT`, `UPDATE`, `DELETE`, `DROP`, o acceda a otros schemas.

---

## 7. Migraciones

| Archivo | Operación |
|---|---|
| `001-create-exercises-table` | Crea tipo ENUM `difficulty_enum` y tabla `exercises` |
| `002-create-exercise-tables-table` | Crea tabla `exercise_tables` con FK a `exercises` |
| `003-create-sandbox-role` | Crea rol `sandbox_user` con `NOLOGIN` |

Ejecutar con:
```bash
npm run typeorm migration:run
```

---

## 8. Seeds

**15 ejercicios en total (5 por nivel).**

### Easy — tabla `employees(id, name, salary, department_id)`
1. SELECT todos los empleados
2. Filtrar por `department_id` con WHERE
3. Ordenar por salario DESC
4. Seleccionar solo columnas `name` y `salary`
5. Filtrar con condición compuesta (AND/OR)

### Medium — tablas `employees` + `departments(id, name)` + `orders(id, employee_id, total, created_at)`
1. INNER JOIN employees con departments
2. GROUP BY department con COUNT de empleados
3. HAVING para filtrar grupos con promedio de salario
4. Subquery en WHERE (empleados con salario mayor al promedio)
5. DISTINCT con ORDER BY múltiple

### Hard — tablas anteriores + `products(id, name, price)` + `sales(id, product_id, employee_id, quantity, sale_date)`
1. CTE para calcular ventas totales por empleado
2. Window function ROW_NUMBER() para ranking por departamento
3. Subquery correlacionada para el producto más vendido por empleado
4. JOIN de 3+ tablas con aggregation
5. Aggregation con FILTER (CASE WHEN / FILTER clause)

Ejecutar con:
```bash
npm run seed
```

---

## 9. Dependencias a instalar

```bash
npm install @nestjs/typeorm typeorm pg class-validator class-transformer @nestjs/config
npm install -D @types/pg
```

---

## 10. Variables de entorno (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ova_sql
PORT=3000
```
