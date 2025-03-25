
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack  screenOptions={{ headerShown: false }}>
      <Stack.Screen  name="index" options={{ title: 'Transactions' }} />
      <Stack.Screen name="transaction-detail" options={{ title: 'Transaction Details' }} />
      <Stack.Screen name="electricity-detail" options={{ title: 'Electricity Details' }} />
    </Stack>
  );
}