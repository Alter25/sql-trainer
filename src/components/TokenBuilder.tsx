import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

type Props = {
  available: string[];
  selected: string[];
  onChange: (tokens: string[]) => void;
};

export default function TokenBuilder({ available, selected, onChange }: Props) {
  const addToken = (t: string) => onChange([...selected, t]);
  const removeAt = (i: number) => onChange(selected.filter((_, idx) => idx !== i));
  const clear = () => onChange([]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tu consulta (toca fichas para armarla):</Text>
      <View style={styles.queryBox}>
        {selected.length === 0 ? (
          <Text style={styles.placeholder}>Toca fichas abajo para construir la consulta…</Text>
        ) : (
          <ScrollView horizontal contentContainerStyle={styles.tokenRow}>
            {selected.map((t, i) => (
              <Pressable key={`${t}-${i}`} onPress={() => removeAt(i)} style={styles.tokenSelected}>
                <Text style={styles.tokenSelectedText}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      <Pressable onPress={clear} style={styles.clearBtn}><Text style={styles.clearText}>Borrar consulta</Text></Pressable>

      <Text style={styles.label}>Fichas disponibles:</Text>
      <View style={styles.bank}>
        {available.map((t, i) => (
          <Pressable key={`${t}-${i}`} onPress={() => addToken(t)} style={styles.token}>
            <Text style={styles.tokenText}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.help}>Tip: toca una ficha en la consulta para quitarla. Ordena las fichas libremente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontWeight: '600', marginBottom: 6, color: '#1f2937' },
  queryBox: { minHeight: 56, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, backgroundColor: '#f8fafc', justifyContent: 'center' },
  placeholder: { color: '#94a3b8' },
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  token: { backgroundColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  tokenText: { color: '#0f172a', fontWeight: '500' },
  tokenSelected: { backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginRight: 6 },
  tokenSelectedText: { color: '#fff', fontWeight: '600' },
  clearBtn: { alignSelf: 'flex-start', marginVertical: 6 },
  clearText: { color: '#dc2626' },
  help: { marginTop: 8, color: '#64748b', fontSize: 12 },
});
