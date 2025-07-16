import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        This is a temporary page for me to test all the page i made so far ,
        please change this page to login and redirect to map.tsx as a landing
        page after sign in
      </Text>
      {/* <Text style={styles.title}>🚗 Parking App</Text> */}

      <View style={styles.buttonContainer}>
        <Text>
          {" "}
          this is just a basic map page structure like how to UI should look
          like
        </Text>
        <Button title="View Map" onPress={() => router.push("/map/map")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Book a Spot" onPress={() => router.push("/booking")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="My Records" onPress={() => router.push("/record")} />
      </View>
      <Text> this is a responsive map page </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="map TESTING"
          onPress={() => router.push("/map/openStreetMap")}
        />
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
