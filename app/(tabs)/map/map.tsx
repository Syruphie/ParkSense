// import surfaceData from "@/assets/data/parks_surfaces.json";
import BottomNav from "@/components/BottomNav";
import LocationShortcutButton from "@/components/LocationShortcutButton";
import ParkingDetailModal from "@/components/ParkingDetailModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";

// const dummyParkingLots = [
//   {
//     id: "lot1",
//     name: "CPA Lot 888",
//     latitude: 51.0462,
//     longitude: -114.0631,
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/e/e1/Calgary-Riverfront.jpg",
//   },
//   {
//     id: "lot2",
//     name: "Calgary City Centre Lot",
//     latitude: 51.0453,
//     longitude: -114.0642,
//   },
//   {
//     id: "lot3",
//     name: "Lot #26 - Centre Street",
//     latitude: 51.0458,
//     longitude: -114.0685,
//   },
// ];

export default function MapPage() {
  const router = useRouter();
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [parkingLots, setParkingLots] = useState<any[]>([]);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };
  const [selectedLot, setSelectedLot] = useState<any>(null);

  useEffect(() => {
    const fetchParkingZones = async () => {
      try {
        const response = await fetch(
          "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }

        const parsed = data
          .filter((item) => item.the_geom?.coordinates?.length > 0)
          .map((item) => {
            const line = item.the_geom.coordinates?.[0]?.[0];
            if (!line || line.length !== 2) return null;

            const [lng, lat] = line; // Geo format: [lng, lat]

            return {
              id:
                item.globalid_guid ||
                `${item.permit_zone}-${item.address_desc}` ||
                Math.random().toString(),
              name: item.zone_type || "Parking Zone",
              latitude: lat,
              longitude: lng,
              address: item.address_desc || "Unknown",
              imageUrl: "https://via.placeholder.com/300x200",
            };
          })
          .filter(Boolean); // remove nulls

        setParkingLots(parsed);
      } catch (err) {
        console.error("Failed to fetch zone data:", err);
      }
    };

    fetchParkingZones();
  }, []);

  const renderedMarkers = useMemo(
    () =>
      parkingLots
        .filter((lot) => !isNaN(lot.latitude) && !isNaN(lot.longitude))
        .map((lot) => (
          <Marker
            key={lot.id}
            coordinate={{ latitude: lot.latitude, longitude: lot.longitude }}
            onPress={() => setSelectedLot(lot)}
          >
            <View style={styles.parkingMarker}>
              <Text style={styles.parkingText}>P</Text>
            </View>
          </Marker>
        )),
    [parkingLots]
  );

  return (
    <View style={styles.container}>
      <MapView
        key={parkingLots.length > 0 ? "loaded" : "loading"}
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

        {/* Dummy parking markers
        {dummyParkingLots.map((lot) => (
          <Marker
            key={lot.id}
            coordinate={{ latitude: lot.latitude, longitude: lot.longitude }}
            onPress={() => setSelectedLot(lot)}
          >
            <View style={styles.parkingMarker}>
              <Text style={styles.parkingText}>P</Text>
            </View>
          </Marker>
        ))} */}
        {renderedMarkers}
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

      <ParkingDetailModal
        visible={!!selectedLot}
        name={selectedLot?.name}
        address={selectedLot?.address ?? "No address"}
        imageUrl={
          selectedLot?.imageUrl ?? "https://via.placeholder.com/300x200"
        }
        onClose={() => setSelectedLot(null)}
        onMoreDetail={() => {
          setSelectedLot(null);
          router.push(`/map/ParkingDetails?id=${selectedLot.id}`);
        }}
      />
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
