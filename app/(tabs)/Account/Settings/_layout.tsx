import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="index" options={{ title: 'index' }} />
       <Stack.Screen name="Notification" options={{ title: 'Notification' }} />
       <Stack.Screen name="AccountDeletion" options={{ title: 'AccountDeletion' }} />

    </Stack>
  );
}
