import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { QueryResult } from '../types';

export default function ResultTable({ result, title }: { result: QueryResult; title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {result.columns.length === 0 ? (
        <Text style={styles.empty}>Sin resultados</Text>
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={[styles.row, styles.headerRow]}>
              {result.columns.map((c, i) => (
                <Text key={i} style={[styles.cell, styles.headerCell]}>{c}</Text>
              ))}
            </View>
            {result.rows.map((row, ri) => (
              <View key={ri} style={styles.row}>
                {row.map((cell, ci) => (
                  <Text key={ci} style={styles.cell}>{String(cell ?? 'NULL')}</Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { fontWeight: '600', marginBottom: 4, color: '#1f2937' },
  empty: { color: '#64748b' },
  row: { flexDirection: 'row' },
  headerRow: { backgroundColor: '#e2e8f0' },
  cell: { minWidth: 100, padding: 6, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 12 },
  headerCell: { fontWeight: '700' },
});
