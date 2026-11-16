import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import TokenBuilder from '../components/TokenBuilder';
import ResultTable from '../components/ResultTable';
import { runQuery, resetSandbox } from '../db/database';
import { friendlySqlError } from '../utils/validate';
import { QueryResult } from '../types';

const playgroundTokens = [
  'SELECT', '*', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER', 'BY', 'ASC', 'DESC',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', '(', ')', ',', ';', '=', '<', '>', '<=', '>=', '<>',
  'GROUP', 'HAVING', 'LIMIT',
  'clientes', 'productos', 'pedidos', 'detalle_pedidos',
  'id', 'nombre', 'email', 'ciudad', 'categoria', 'precio', 'cliente_id', 'fecha', 'total', 'pedido_id', 'producto_id', 'cantidad',
  "'Madrid'", "'Barcelona'", "'Valencia'", "'Sevilla'", '50', '100', '1', '2', '3'
];

export default function PlaygroundScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const sql = selected.join(' ').replace(/\s+([,;()])/g, '$1').replace(/([()])\s+/g, '$1');

  const ejecutar = async () => {
    setError(null); setMsg(null);
    try {
      const res = await runQuery(sql);
      setResult(res);
    } catch (e: any) {
      setError(friendlySqlError(e?.message || String(e)));
      setResult(null);
    }
  };

  const reset = async () => {
    await resetSandbox();
    setMsg('Base de datos de práctica reiniciada.');
    setResult(null); setError(null); setSelected([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Playground SQL</Text>
      <Text style={styles.desc}>Explora la BD de tienda (clientes, productos, pedidos, detalle_pedidos) armando consultas con fichas.</Text>
      <TokenBuilder available={playgroundTokens} selected={selected} onChange={setSelected} />
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.primary]} onPress={ejecutar}><Text style={styles.btnTextPrimary}>Ejecutar</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => { setSelected([]); setResult(null); setError(null); }}><Text style={styles.btnText}>Limpiar</Text></Pressable>
        <Pressable style={[styles.btn, styles.warn]} onPress={reset}><Text style={styles.btnText}>Reiniciar BD</Text></Pressable>
      </View>
      <Text style={styles.sqlPreview}>Consulta: {sql || '(vacía)'}</Text>
      {msg && <Text style={styles.msg}>{msg}</Text>}
      {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      {result && <ResultTable result={result} title="Resultado" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  desc: { color: '#475569', marginVertical: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#e2e8f0' },
  primary: { backgroundColor: '#2563eb' },
  warn: { backgroundColor: '#fde68a' },
  btnText: { color: '#0f172a', fontWeight: '600' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  sqlPreview: { fontFamily: 'monospace', color: '#334155', marginVertical: 6 },
  errorBox: { backgroundColor: '#fee2e2', padding: 10, borderRadius: 8, marginVertical: 6 },
  errorText: { color: '#991b1b' },
  msg: { color: '#166534', marginVertical: 4 },
});
