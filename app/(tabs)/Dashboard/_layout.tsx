import { Stack } from "expo-router";

export default function Layout() {
  return (
 <Stack screenOptions={{ headerShown: false }}>
 <Stack.Screen  name="index" options={{ title: 'Dashboard' }} />
 <Stack.Screen name="BuyData" options={{ title: 'BuyData' }} />
 <Stack.Screen name="BuyAirtime" options={{ title: 'BuyAirtime' }} />
 <Stack.Screen name="Electricity" options={{ title: 'Electricity' }} />
 <Stack.Screen name="AirtimeSwap" options={{ title: 'AirtimeSwap' }} />
 <Stack.Screen name="Edupin" options={{ title: 'Edupin' }} />
    </Stack>
  );
}
