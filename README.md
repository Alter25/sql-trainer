# SQL Trainer (React Native / Expo)

App móvil didáctica en español para aprender SQL desde cero usando una base de datos SQLite local y ejercicios con **constructor de fichas** (sin teclado).

## Requisitos
- Node.js y npm instalados (ya presentes en este entorno)
- Teléfono Android con la app **Expo Go** instalada (desde Google Play)
- Teléfono y computadora en la misma red Wi‑Fi (o usar modo túnel)

## Cómo ejecutar en tu teléfono (sin Android Studio)
1. Abre una terminal en la carpeta del proyecto:
   ```bash
   cd sql-trainer
   npm install   # solo la primera vez (ya instalado)
   npm start
   ```
2. Se abrirá el servidor de desarrollo de Expo y verás un **código QR**.
3. En tu teléfono Android, abre **Expo Go** y escanea el QR.
4. La app se cargará en tu teléfono. Si estás en redes distintas, usa: `npx expo start --tunnel`.

## Qué incluye (MVP)
- Base de datos local de práctica ("tienda"): `clientes`, `productos`, `pedidos`, `detalle_pedidos` (se reinicia al iniciar la app; reiniciable desde Playground).
- Niveles progresivos con ejercicios reales (N1 Fundamentos, N2 Filtros/Orden, N3 Agregaciones) y desbloqueo por progreso.
- Constructor de consultas por **fichas libres**: toca fichas para armar el SQL, ejecuta, compara con el resultado esperado y recibe pistas/errores en español.
- Playground para explorar con fichas.
- Progreso guardado localmente en el dispositivo.

## Estructura
- `App.tsx` navegación e inicialización de BD
- `src/db/database.ts` sandbox SQLite, seed y progreso
- `src/data/levels.ts` niveles y ejercicios
- `src/components/TokenBuilder.tsx` constructor de fichas
- `src/screens/` pantallas (Home, Exercise, Playground)

## Notas
- El modo práctica solo permite consultas `SELECT`.
- `ios/` y `android/` no se editan a mano (CNG de Expo). Configuración nativa en `app.json`.
