// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />    {/* Auth folder (login/register) */}
      <Stack.Screen name="(tabs)" />  {/* Main app after login */}
    </Stack>
  );
}
