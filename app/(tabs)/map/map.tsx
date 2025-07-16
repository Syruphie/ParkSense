import BottomNav from "@/components/BottomNav";
import LocationShortcutButton from "@/components/LocationShortcutButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";

const dummyParkingLots = [
  {
    id: "lot1",
    name: "CPA Lot 888",
    latitude: 51.0462,
    longitude: -114.0631,
  },
  {
    id: "lot2",
    name: "Calgary City Centre Lot",
    latitude: 51.0453,
    longitude: -114.0642,
  },
  {
    id: "lot3",
    name: "Lot #26 - Centre Street",
    latitude: 51.0458,
    longitude: -114.0685,
  },
];

export default function MapPage() {
  const router = useRouter();
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.0447,
          longitude: -114.0719,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        provider={PROVIDER_DEFAULT}
        mapType="none"
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* User placed marker */}
        {marker && (
          <Marker
            coordinate={marker}
            title="Dropped Pin"
            description={`${marker.latitude.toFixed(
              4
            )}, ${marker.longitude.toFixed(4)}`}
          />
        )}

        {/* Dummy parking markers */}
        {dummyParkingLots.map((lot) => (
          <Marker
            key={lot.id}
            coordinate={{ latitude: lot.latitude, longitude: lot.longitude }}
            title={lot.name}
          >
            <View style={styles.parkingMarker}>
              <Text style={styles.parkingText}>P</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/map/Search")}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>

      {/* Shortcut buttons */}
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
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  searchButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#84B4FF",
    padding: 10,
    borderRadius: 24,
    zIndex: 10,
  },
  shortcutsRow: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    zIndex: 11,
  },
  parkingMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#84B4FF", // match your UI blue
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff", // optional border
  },

  parkingText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
