export type QueryResult = {
  columns: string[];
  rows: any[][];
};

export type Exercise = {
  id: string;
  levelId: string;
  title: string;
  prompt: string;
  hint: string;
  explanation: string;
  tokens: string[];
  expectedSql: string;
};

export type Level = {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
};
