import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
 <Stack.Screen  name="index" options={{ title: 'Dashboard' }} />
 <Stack.Screen name="BuyData" options={{ title: 'BuyData' }} />
    </Stack>
  );
}
