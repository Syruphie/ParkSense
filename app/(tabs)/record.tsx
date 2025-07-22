import { StyleSheet, Text, View } from "react-native";

export default function BookingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Record Page</Text>
        {/* Add more content here */}
      </View>

      {/* <BottomNav /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // makes full screen
    justifyContent: "space-between", // pushes content + nav apart
  },
  content: {
    flex: 1, // grow to fill space above BottomNav
    padding: 20,
  },
});
