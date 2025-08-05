import LocationShortcutButton from "@/components/LocationShortcutButton";
import ParkingDetailModal from "@/components/ParkingDetailModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

let streetViewUsageCount = 0;
const MAX_USAGE = 200;

const getStreetViewImage = (
  lat: number,
  lng: number,
  apiKey: string
): string | null => {
  if (streetViewUsageCount >= MAX_USAGE) return null;
  streetViewUsageCount++;
  return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=90&pitch=10&key=${apiKey}`;
};

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const SHORTCUTS = {
  Home: {
    label: "Home",
    latitude: 51.045,
    longitude: -114.065,
  },
  Office: {
    label: "Office",
    latitude: 51.0465,
    longitude: -114.063,
  },
  Recent: {
    label: "Recent Visit",
    latitude: 51.051,
    longitude: -114.071,
  },
};

export default function MapPage() {
  type ParkingLot = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    imageUrl: string;
  };

  type FlyToLabel = {
    latitude: number;
    longitude: number;
    label: string;
  };

  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [flyToLabel, setFlyToLabel] = useState<FlyToLabel | null>(null);

  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };

  const flyTo = ({
    latitude,
    longitude,
    label,
  }: {
    latitude: number;
    longitude: number;
    label: string;
  }) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
    setFlyToLabel({ latitude, longitude, label });
  };

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) console.warn("GOOGLE_API_KEY is missing!");

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
                getStreetViewImage(lat, lng, apiKey || "") ||
                "https://via.placeholder.com/300x200",
            };
          })
          .filter((lot): lot is ParkingLot => lot !== null);

        const deduplicated: ParkingLot[] = [];

        parsed.forEach((lot) => {
          const nearbyLots = deduplicated.filter((d) => {
            const distance = getDistanceMeters(
              d.latitude,
              d.longitude,
              lot.latitude,
              lot.longitude
            );
            return distance < 250;
          });

          if (nearbyLots.length < 2) {
            deduplicated.push(lot);
          }
        });

        setParkingLots(deduplicated);
      } catch (err) {
        console.error("Failed to fetch zone data:", err);
      }
    };

    fetchParkingZones();
  }, []);

  const renderedMarkers = useMemo(() => {
    let nearbyLots = parkingLots;
    if (marker) {
      nearbyLots = parkingLots
        .filter((lot) => {
          const distance = getDistanceMeters(
            marker.latitude,
            marker.longitude,
            lot.latitude,
            lot.longitude
          );
          return distance <= 100;
        })
        .slice(0, 2);
    }

    return nearbyLots
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
      ));
  }, [parkingLots, marker]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003f88" />

      {/* ✅ Cross-platform header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/map/Search")}
          style={styles.headerIcon}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Map</Text>

        <View style={styles.headerSpacer} />
      </View>

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
        ref={mapRef}
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

        {renderedMarkers}

        {flyToLabel && (
          <Marker
            coordinate={{
              latitude: flyToLabel.latitude,
              longitude: flyToLabel.longitude,
            }}
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <View style={styles.flyToPopup}>
              <Text style={styles.flyToPopupText}>{flyToLabel.label}</Text>
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.shortcutsRow}>
        <LocationShortcutButton
          label="Home"
          onPress={() => flyTo({ ...SHORTCUTS.Home, label: "Home" })}
        />
        <LocationShortcutButton
          label="Office"
          onPress={() => flyTo({ ...SHORTCUTS.Office, label: "Office" })}
        />
        <LocationShortcutButton
          label="Recent Visit"
          onPress={() => flyTo({ ...SHORTCUTS.Recent, label: "Recent Visit" })}
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
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.select({ ios: 100, android: 60 }),
    paddingTop: Platform.select({ ios: 44, android: StatusBar.currentHeight || 20 }),
    backgroundColor: "#84B4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcon: {
    padding: 5,
  },
  headerSpacer: {
    width: 24,
  },
  shortcutsRow: {
    position: "absolute",
  bottom: 20,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 10, // optional: spacing between buttons (requires RN 0.71+)
  paddingHorizontal: 20,
  zIndex: 11,
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
    top: Platform.select({ ios: 110, android: 80 }),
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
  flyToPopup: {
    backgroundColor: "#003f88",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  flyToPopupText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },
});
