import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function OnboardingLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="goal" />
        <Stack.Screen name="weight" />
        <Stack.Screen name="height" />
        <Stack.Screen name="activity" />
        <Stack.Screen name="sex" />
        <Stack.Screen name="dob" />
        <Stack.Screen name="bodyfat" />
        <Stack.Screen name="lifestyle" />
        <Stack.Screen name="diet" />
        <Stack.Screen name="target-weight" />
        <Stack.Screen name="wellness-summary" />
        <Stack.Screen name="life-events" />
        <Stack.Screen name="event-date" />
        <Stack.Screen name="meal-plan" />
        <Stack.Screen name="plan-preview" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="loading" />
        <Stack.Screen name="review" />
      </Stack>
    </>
  );
}
