import * as SQLite from 'expo-sqlite';
import { QueryResult } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

const seedSql = `
DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS clientes;

CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  ciudad TEXT NOT NULL
);

CREATE TABLE productos (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio REAL NOT NULL
);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE detalle_pedidos (
  id INTEGER PRIMARY KEY,
  pedido_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO clientes (id, nombre, email, ciudad) VALUES
(1, 'Ana López', 'ana@example.com', 'Madrid'),
(2, 'Luis Pérez', 'luis@example.com', 'Barcelona'),
(3, 'María García', 'maria@example.com', 'Madrid'),
(4, 'Carlos Ruiz', 'carlos@example.com', 'Valencia'),
(5, 'Sofía Díaz', 'sofia@example.com', 'Sevilla');

INSERT INTO productos (id, nombre, categoria, precio) VALUES
(1, 'Teclado', 'Electrónica', 25.0),
(2, 'Ratón', 'Electrónica', 15.0),
(3, 'Monitor', 'Electrónica', 120.0),
(4, 'Silla', 'Oficina', 80.0),
(5, 'Escritorio', 'Oficina', 150.0),
(6, 'Libreta', 'Papelería', 5.0);

INSERT INTO pedidos (id, cliente_id, fecha, total) VALUES
(1, 1, '2026-01-10', 40.0),
(2, 2, '2026-02-05', 120.0),
(3, 1, '2026-02-20', 15.0),
(4, 3, '2026-03-01', 230.0),
(5, 4, '2026-03-15', 5.0),
(6, 1, '2026-04-02', 80.0);

INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 2, 3, 1),
(4, 3, 2, 1),
(5, 4, 4, 1),
(6, 4, 5, 1),
(7, 5, 6, 1),
(8, 6, 4, 1);
`;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('sandbox.db');
  }
  return db;
}

export async function resetSandbox() {
  const database = await getDb();
  await database.execAsync(seedSql);
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const database = await getDb();
  const trimmed = sql.trim().replace(/;$/, '');
  if (!trimmed) return { columns: [], rows: [] };
  if (!/^select\b/i.test(trimmed)) {
    throw new Error('Por ahora solo se permiten consultas SELECT en el modo práctica.');
  }
  const statement = await database.prepareAsync(trimmed);
  try {
    const result = await statement.executeAsync();
    const rowsObj = await result.getAllAsync();
    const columns = await statement.getColumnNamesAsync();
    const rows = rowsObj.map((r: any) => columns.map((c) => r[c]));
    return { columns, rows };
  } finally {
    await statement.finalizeAsync();
  }
}

export async function initProgressDb() {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS progreso (
      exercise_id TEXT PRIMARY KEY,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export async function markExerciseCompleted(exerciseId: string) {
  const database = await getDb();
  await database.runAsync(
    'INSERT OR REPLACE INTO progreso (exercise_id, completed) VALUES (?, 1)',
    [exerciseId]
  );
}

export async function getCompletedExercises(): Promise<Set<string>> {
  const database = await getDb();
  const rows = await database.getAllAsync<{ exercise_id: string }>(
    'SELECT ejercicio_id FROM progreso WHERE completed = 1'.replace('ejercicio_id','exercise_id')
  );
  return new Set(rows.map((r) => r.exercise_id));
}
