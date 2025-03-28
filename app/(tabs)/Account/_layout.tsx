import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="index" options={{ title: 'index' }} />
 <Stack.Screen name="personalinfo" options={{ title: 'personalinfo' }} />
 <Stack.Screen name="Support" options={{ title: 'Support' }} />
 <Stack.Screen name="Privacy" options={{ title: 'Privacy' }} />
    </Stack>
  );
}
