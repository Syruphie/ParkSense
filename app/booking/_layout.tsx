// app/booking/_layout.tsx
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
      <Stack.Screen 
        name="confirm-booking" 
        options={{ 
          title: 'Confirm Booking',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="checkout-success" 
        options={{ 
          title: 'Payment Success',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="remaining-time" 
        options={{ 
          title: 'Active Parking',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}