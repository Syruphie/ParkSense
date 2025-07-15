import BottomNav from "@/components/BottomNav";
import { StyleSheet, Text, View } from "react-native";

export default function BookingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Page</Text>
      {/* page content */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 64, // space for bottom nav
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 60,
    textAlign: "center",
  },
});
