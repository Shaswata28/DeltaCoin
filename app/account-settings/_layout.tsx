import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="security" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}