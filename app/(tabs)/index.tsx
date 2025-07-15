import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Parking App</Text>
      <View style={styles.buttonContainer}>
        <Button title="View Map" onPress={() => router.push("/map")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Book a Spot" onPress={() => router.push("/booking")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="My Records" onPress={() => router.push("/record")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginVertical: 10,
    width: "100%",
  },
});
