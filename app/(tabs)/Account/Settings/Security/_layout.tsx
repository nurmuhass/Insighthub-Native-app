import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="index" options={{ title: 'index' }} />
       <Stack.Screen name="changepass" options={{ title: 'Change Password' }} />
       <Stack.Screen name="changePassCode" options={{ title: 'changePassCode' }} />
       <Stack.Screen name="resetPasscode" options={{ title: 'resetPasscode' }} />

    </Stack>
  );
}
