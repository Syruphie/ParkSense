import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Bookings',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}