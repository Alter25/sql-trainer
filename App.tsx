import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import PlaygroundScreen from './src/screens/PlaygroundScreen';
import { resetSandbox, initProgressDb } from './src/db/database';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await resetSandbox();
        await initProgressDb();
        setReady(true);
      } catch (e: any) {
        setErr(e?.message || String(e));
      }
    })();
  }, []);

  if (err) return <View style={{flex:1,justifyContent:'center',padding:20}}><Text>Error iniciando BD: {err}</Text></View>;
  if (!ready) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /><Text style={{marginTop:8}}>Preparando base de datos...</Text></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ruta de aprendizaje' }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'Ejercicio' }} />
        <Stack.Screen name="Playground" component={PlaygroundScreen} options={{ title: 'Playground' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
