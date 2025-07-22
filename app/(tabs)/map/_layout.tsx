import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Map',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="Search" 
        options={{ title: 'Search Parking' }} 
      />
      <Stack.Screen 
        name="ParkingDetails" 
        options={{ title: 'Parking Details' }} 
      />
      <Stack.Screen 
        name="openStreetMap" 
        options={{ title: 'Street Map' }} 
      />
    </Stack>
  );
}