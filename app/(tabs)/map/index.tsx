
import LocationShortcutButton from "@/components/LocationShortcutButton";
import ParkingDetailModal from "@/components/ParkingDetailModal";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

let streetViewUsageCount = 0; //streetViewUsageCount: Limits how many street view images are fetched.
const MAX_USAGE = 200; //to make sure i am not getting charge for the google API
const getStreetViewImage = (
  lat: number,
  lng: number,
  apiKey: string
): string | null => {
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

  const mapRef = useRef<MapView | null>(null); //Reference to the map for controlling it (e.g., zoom/fly).
  const router = useRouter();
  const [marker, setMarker] = useState<{
    //Stores a user-dropped pin (lat/lng).
    latitude: number;
    longitude: number;
  } | null>(null);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null); // The marker user tapped to show a modal.
  const [flyToLabel, setFlyToLabel] = useState<FlyToLabel | null>(null);
  
  // NEW: Location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };

  //Moves the map to the given lat/lng using animation.
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

  // NEW: Function to get user's current location
  const getUserLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationPermissionGranted(false);
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. The app will show Calgary downtown area.',
          [{ text: 'OK' }]
        );
        return;
      }

      setLocationPermissionGranted(true);

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Animate map to user's location
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1500
      );

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Could not get your current location. Showing Calgary downtown area.',
        [{ text: 'OK' }]
      );
    }
  };

  // NEW: Function to center on user location (for manual trigger)
  const centerOnUserLocation = () => {
    if (userLocation) {
      flyTo({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        label: "Your Location"
      });
    } else {
      getUserLocation();
    }
  };

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) console.warn("GOOGLE_API_KEY is missing!");

  // NEW: Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

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
                  process.env.EXPO_PUBLIC_GOOGLE_API_KEY || ""
                ) || "https://via.placeholder.com/300x200",
            };
          })
          .filter((lot): lot is ParkingLot => lot !== null);

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
          latitude: userLocation?.latitude || 51.0447,
          longitude: userLocation?.longitude || -114.0719,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        provider={PROVIDER_DEFAULT}
        mapType="none"
        ref={mapRef}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={false}
        followsUserLocation={false}
      >
        <UrlTile
          urlTemplate="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
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

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/map/Search")}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>

      {/* NEW: Custom "My Location" button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={centerOnUserLocation}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

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
  searchButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#84B4FF",
    padding: 10,
    borderRadius: 24,
    zIndex: 10,
  },
  // NEW: Location button style
  locationButton: {
    position: "absolute",
    top: 50,
    right: 20,
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