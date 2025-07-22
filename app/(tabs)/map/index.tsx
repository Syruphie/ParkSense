import LocationShortcutButton from "@/components/LocationShortcutButton";
import ParkingDetailModal from "@/components/ParkingDetailModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

let streetViewUsageCount = 0;
const MAX_USAGE = 200;
const getStreetViewImage = (lat, lng, apiKey) => {
  if (streetViewUsageCount >= MAX_USAGE) return null;
  streetViewUsageCount++;
  return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=90&pitch=10&key=${apiKey}`;
};

const SHORTCUTS = {
  Home: {
    label: "Home",
    latitude: 51.045, // 9 Ave SW
    longitude: -114.065,
  },
  Office: {
    label: "Office",
    latitude: 51.0465, // 2 St SW
    longitude: -114.063,
  },
  Recent: {
    label: "Recent Visit",
    latitude: 51.051, // 25 Ave SW
    longitude: -114.071,
  },
};

export default function MapPage() {
  const mapRef = useRef(null);
  const router = useRouter();
  const [marker, setMarker] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };

  const flyTo = ({ latitude, longitude }) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) console.warn("⚠️ GOOGLE_API_KEY is missing!");

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

            const [lng, lat] = line;
            const address = item.address_desc || "Unknown";

            return {
              id:
                item.globalid_guid ||
                `${item.permit_zone}-${item.address_desc}` ||
                Math.random().toString(),
              name: item.zone_type || "Parking Zone",
              latitude: lat,
              longitude: lng,
              address,
              imageUrl:
                getStreetViewImage(
                  lat,
                  lng,
                  process.env.EXPO_PUBLIC_GOOGLE_API_KEY
                ) || "https://via.placeholder.com/300x200",
            };
          })
          .filter(Boolean);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#CCDBFD" />

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
        ref={mapRef}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {marker && (
          <Marker
            coordinate={marker}
            title="Dropped Pin"
            description={`${marker.latitude.toFixed(
              4
            )}, ${marker.longitude.toFixed(4)}`}
          />
        )}

        {renderedMarkers}
      </MapView>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/map/Search")}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.shortcutsRow}>
        <LocationShortcutButton
          label="Home"
          onPress={() => flyTo(SHORTCUTS.Home)}
        />
        <LocationShortcutButton
          label="Office"
          onPress={() => flyTo(SHORTCUTS.Office)}
        />
        <LocationShortcutButton
          label="Recent Visit"
          onPress={() => flyTo(SHORTCUTS.Recent)}
        />
      </View>

      <TouchableOpacity
        style={styles.listButton}
        onPress={() => router.push("/map/ParkingList")}
      >
        <Ionicons name="list" size={20} color="white" />
        <Text style={styles.listButtonText}>Dataset: Parking List</Text>
      </TouchableOpacity>

      <ParkingDetailModal
        visible={!!selectedLot}
        name={selectedLot?.name || "Unknown"}
        address={selectedLot?.address || "No address"}
        latitude={selectedLot?.latitude || 0}
        longitude={selectedLot?.longitude || 0}
        imageUrl={
          selectedLot?.imageUrl || "https://via.placeholder.com/300x200"
        }
        googleApiKey={apiKey || ""}
        onClose={() => setSelectedLot(null)}
        onMoreDetail={() => {
          setSelectedLot(null);
          router.push(`/map/ParkingDetails?id=${selectedLot?.id}`);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCDBFD",
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
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    zIndex: 11,
    shadowColor: "#000",
  },
  parkingMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#84B4FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  parkingText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  listButton: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "#4B70FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  listButtonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },
});
