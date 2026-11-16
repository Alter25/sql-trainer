import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { levels } from '../data/levels';
import { getCompletedExercises } from '../db/database';

export default function HomeScreen({ navigation }: any) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      getCompletedExercises().then(setCompleted).catch(() => {});
    }, [])
  );

  const isLevelUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true;
    const prev = levels[levelIndex - 1];
    return prev.exercises.every((e) => completed.has(e.id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Aprende SQL</Text>
      <Text style={styles.sub}>Practica con una base de datos local (tienda). Completa ejercicios para desbloquear niveles.</Text>
      {levels.map((level, idx) => {
        const unlocked = isLevelUnlocked(idx);
        const doneCount = level.exercises.filter((e) => completed.has(e.id)).length;
        return (
          <View key={level.id} style={[styles.card, !unlocked && styles.cardLocked]}>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelDesc}>{level.description}</Text>
            <Text style={styles.progress}>Progreso: {doneCount}/{level.exercises.length}</Text>
            {unlocked ? (
              <View style={styles.exList}>
                {level.exercises.map((ex) => (
                  <Pressable
                    key={ex.id}
                    style={[styles.exBtn, completed.has(ex.id) && styles.exBtnDone]}
                    onPress={() => navigation.navigate('Exercise', { exerciseId: ex.id })}
                  >
                    <Text style={styles.exBtnText}>
                      {completed.has(ex.id) ? '✓ ' : ''}{ex.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.lockedText}>🔒 Completa el nivel anterior para desbloquear.</Text>
            )}
          </View>
        );
      })}
      <Pressable style={styles.playgroundBtn} onPress={() => navigation.navigate('Playground')}>
        <Text style={styles.playgroundText}>Abrir Playground (SQL libre con fichas)</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#f1f5f9' },
  header: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  sub: { color: '#475569', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardLocked: { opacity: 0.7 },
  levelTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  levelDesc: { color: '#475569', marginTop: 2 },
  progress: { marginTop: 6, fontWeight: '600', color: '#2563eb' },
  exList: { marginTop: 8, gap: 6 },
  exBtn: { backgroundColor: '#e0e7ff', padding: 10, borderRadius: 8 },
  exBtnDone: { backgroundColor: '#dcfce7' },
  exBtnText: { color: '#1e293b', fontWeight: '500' },
  lockedText: { marginTop: 8, color: '#64748b' },
  playgroundBtn: { marginTop: 8, backgroundColor: '#0f172a', padding: 14, borderRadius: 10, alignItems: 'center' },
  playgroundText: { color: '#fff', fontWeight: '700' },
});
