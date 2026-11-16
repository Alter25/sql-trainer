import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { levels } from '../data/levels';
import TokenBuilder from '../components/TokenBuilder';
import ResultTable from '../components/ResultTable';
import { runQuery, markExerciseCompleted } from '../db/database';
import { resultsEqual, friendlySqlError } from '../utils/validate';
import { QueryResult } from '../types';

export default function ExerciseScreen({ route, navigation }: any) {
  const { exerciseId } = route.params;
  const exercise = useMemo(() => {
    for (const l of levels) for (const e of l.exercises) if (e.id === exerciseId) return e;
    return null;
  }, [exerciseId]);

  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [expected, setExpected] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [showHint, setShowHint] = useState(false);

  if (!exercise) return <View style={styles.container}><Text>Ejercicio no encontrado.</Text></View>;

  const sql = selected.join(' ').replace(/\s+([,;()])/g, '$1').replace(/([()])\s+/g, '$1');

  const ejecutar = async () => {
    setError(null);
    setExpected(null);
    setStatus('idle');
    try {
      const userRes = await runQuery(sql);
      const expRes = await runQuery(exercise.expectedSql);
      setResult(userRes);
      const ok = resultsEqual(userRes, expRes);
      if (ok) {
        setStatus('ok');
        await markExerciseCompleted(exercise.id);
      } else {
        setStatus('bad');
        setExpected(expRes);
      }
    } catch (e: any) {
      setError(friendlySqlError(e?.message || String(e)));
      setResult(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise.title}</Text>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <TokenBuilder available={exercise.tokens} selected={selected} onChange={setSelected} />
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.primary]} onPress={ejecutar}><Text style={styles.btnTextPrimary}>Ejecutar</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => setShowHint((s) => !s)}><Text style={styles.btnText}>Pista</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => { setSelected([]); setResult(null); setExpected(null); setError(null); setStatus('idle'); }}><Text style={styles.btnText}>Reiniciar</Text></Pressable>
      </View>
      {showHint && <View style={styles.infoBox}><Text style={styles.infoTitle}>Pista</Text><Text>{exercise.hint}</Text></View>}
      <Text style={styles.sqlPreview}>Consulta: {sql || '(vacía)'}</Text>
      {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      {status === 'ok' && <View style={styles.okBox}><Text style={styles.okText}>¡Correcto! {exercise.explanation}</Text></View>}
      {status === 'bad' && <View style={styles.badBox}><Text style={styles.badText}>Aún no coincide con el resultado esperado. Revisa las fichas o compara abajo.</Text></View>}
      {result && <ResultTable result={result} title="Tu resultado" />}
      {expected && <ResultTable result={expected} title="Resultado esperado" />}
      <Pressable style={styles.back} onPress={() => navigation.goBack()}><Text style={styles.backText}>Volver a niveles</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  prompt: { color: '#334155', marginBottom: 8, lineHeight: 20 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#e2e8f0' },
  primary: { backgroundColor: '#2563eb' },
  btnText: { color: '#0f172a', fontWeight: '600' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  infoBox: { backgroundColor: '#eff6ff', padding: 10, borderRadius: 8, marginVertical: 6 },
  infoTitle: { fontWeight: '700', marginBottom: 2 },
  sqlPreview: { fontFamily: 'monospace', color: '#334155', marginVertical: 6 },
  errorBox: { backgroundColor: '#fee2e2', padding: 10, borderRadius: 8, marginVertical: 6 },
  errorText: { color: '#991b1b' },
  okBox: { backgroundColor: '#dcfce7', padding: 10, borderRadius: 8, marginVertical: 6 },
  okText: { color: '#166534', fontWeight: '600' },
  badBox: { backgroundColor: '#fef9c3', padding: 10, borderRadius: 8, marginVertical: 6 },
  badText: { color: '#854d0e' },
  back: { marginTop: 12, alignItems: 'center', padding: 10 },
  backText: { color: '#2563eb', fontWeight: '600' },
});
