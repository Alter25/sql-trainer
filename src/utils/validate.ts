import { QueryResult } from '../types';

function normalizeValue(v: any) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number(v.toFixed(6));
  return String(v);
}

export function resultsEqual(a: QueryResult, b: QueryResult): boolean {
  if (a.columns.length !== b.columns.length) return false;
  if (a.rows.length !== b.rows.length) return false;
  const colsA = a.columns.map((c) => c.toLowerCase());
  const colsB = b.columns.map((c) => c.toLowerCase());
  for (let i = 0; i < colsA.length; i++) if (colsA[i] !== colsB[i]) return false;
  const norm = (r: any[]) => JSON.stringify(r.map(normalizeValue));
  const rowsA = a.rows.map(norm).sort();
  const rowsB = b.rows.map(norm).sort();
  for (let i = 0; i < rowsA.length; i++) if (rowsA[i] !== rowsB[i]) return false;
  return true;
}

export function friendlySqlError(message: string): string {
  const m = message || '';
  if (/no such table/i.test(m)) return 'Esa tabla no existe en la base de práctica. Revisa el nombre en las fichas.';
  if (/no such column/i.test(m)) return 'Esa columna no existe. Verifica la tabla y el nombre de la columna.';
  if (/syntax error/i.test(m)) return 'Hay un error de sintaxis. Revisa el orden de las fichas (por ejemplo SELECT ... FROM ...).';
  if (/ambiguous column/i.test(m)) return 'Columna ambigua: indica a qué tabla pertenece.';
  return `Error SQL: ${m}`;
}
