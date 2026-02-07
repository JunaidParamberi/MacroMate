import { Stack } from 'expo-router';

export default function LogLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="food" />
      <Stack.Screen name="barcode" />
      <Stack.Screen name="voice" />
      <Stack.Screen name="meal-scan" />
      <Stack.Screen name="water" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="exercise" />
    </Stack>
  );
}
