import { Stack } from 'expo-router';
export default function RecordLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Records',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="RecordDetails" 
        options={{ title: 'Record Details', headerShown: false }} 
      />
    </Stack>
  );
}