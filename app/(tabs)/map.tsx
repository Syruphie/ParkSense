import BottomNav from "@/components/BottomNav";
import LocationShortcutButton from "@/components/LocationShortcutButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

export default function MapPage() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };

  return (
    <View style={styles.container}>
      {/* Map Layer */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.0447,
          longitude: -114.0719,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        provider="google"
      >
        {marker && (
          <Marker
            coordinate={marker}
            title="Dropped Pin"
            description={`${marker.latitude.toFixed(
              4
            )}, ${marker.longitude.toFixed(4)}`}
          />
        )}
      </MapView>

      {/* Search Button Layer */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/Search")} // ← updated here
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>

      {/* Search Popup & Nav always on top */}
      {/* <SearchPopup visible={showSearch} onClose={() => setShowSearch(false)} /> */}
      <View style={styles.shortcutsRow}>
        <LocationShortcutButton label="Home" onPress={() => {}} />
        <LocationShortcutButton label="Office" onPress={() => {}} />
        <LocationShortcutButton label="Recent Visit" onPress={() => {}} />
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Ensure layering context
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Put map behind
  },
  searchButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#84B4FF",
    padding: 10,
    borderRadius: 24,
    zIndex: 10, // Ensure it's above map
  },
  shortcutsRow: {
    position: "absolute",
    bottom: 80, // adjust as needed based on your BottomNav height
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap", // allow multiple rows
    justifyContent: "center",
    zIndex: 11, // ← Make sure this is above BottomNav and Map
  },
});
