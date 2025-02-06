import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="index" options={{ title: 'index' }} />
 <Stack.Screen name="Automatic" options={{ title: 'Automatic' }} />
 <Stack.Screen name="Manual" options={{ title: 'Manual' }} />

    </Stack>
  );
}
