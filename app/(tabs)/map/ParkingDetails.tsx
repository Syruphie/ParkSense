"use client";

import ParkingDetailCard from "@/components/detailpage/ParkingDetailCard";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "";
if (!apiKey) console.warn("\u26A0\uFE0F GOOGLE_API_KEY is missing!");

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ParkingDetails() {
  const router = useRouter();
  const { id, place_id, lat, lng } = useLocalSearchParams();
  const [lot, setLot] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationText, setDurationText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(
    "https://via.placeholder.com/300x200"
  );

  const fetchFromCoords = async (lat, lng) => {
    try {
      const parkingRes = await fetch(
        "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
      );
      const parkingData = await parkingRes.json();

      const matched = parkingData.find((p) => {
        const coords = p.the_geom?.coordinates?.[0]?.[0];
        if (!Array.isArray(coords) || coords.length !== 2) return false;
        const [plng, plat] = coords;
        const dist = haversineDistance(lat, lng, plat, plng);
        return dist < 0.2;
      });

      if (matched) {
        console.log("Matched record by lat/lng:", matched);
      } else {
        console.warn("No matching parking zone within 200m (lat/lng fallback)");
      }

      setLot({
        ...matched,
        address_desc: matched?.address_desc || "Unknown",
        zone_type: "Parking Zone",
        editorial_summary: null,
      });

      const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=0&pitch=10&radius=50&key=${apiKey}`;
      setImageUrl(streetViewUrl);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const userLocation = await Location.getCurrentPositionAsync({});
        const distance = haversineDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          lat,
          lng
        );
        setDistanceKm(distance.toFixed(2));

        const driveTime = await fetchDrivingTime(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          lat,
          lng
        );
        setDurationText(driveTime);
      }
    } catch (err) {
      console.error("Error in fetchFromCoords:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivingTime = async (fromLat, fromLng, toLat, toLng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&mode=driving&key=${apiKey}`
      );
      const json = await res.json();
      return json.routes?.[0]?.legs?.[0]?.duration?.text || null;
    } catch (error) {
      console.warn("Error fetching drive time:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFromGooglePlace = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=editorial_summary,geometry,formatted_address,types,name&key=${apiKey}`
        );
        const json = await res.json();
        const result = json.result;

        if (!result) return setLoading(false);

        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;
        const address = result.formatted_address;

        const parkingRes = await fetch(
          "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
        );
        const parkingData = await parkingRes.json();

        const matched = parkingData.find((p) => {
          const coords = p.the_geom?.coordinates?.[0]?.[0];
          if (!Array.isArray(coords) || coords.length !== 2) return false;
          const [plng, plat] = coords;
          const dist = haversineDistance(lat, lng, plat, plng);
          return dist < 0.2;
        });

        if (matched) {
          console.log("Matched record by lat/lng:", matched);
          setLot({
            ...matched,
            address_desc: matched?.address_desc || "Unknown",
            zone_type: "Parking Zone",
            editorial_summary: null,
          });
        } else {
          setLot({
            zone_type: "Parking Zone",
            address_desc: "No matching parking zone within 200m.",
            editorial_summary: null,
          });
        }

        setLot({
          address_desc: address,
          zone_type: result.types?.[0] || "Point of Interest",
          editorial_summary: result.editorial_summary,
          rate_amount: matched?.rate_amount || null,
          rate_period_desc: matched?.rate_period_desc || null,
          max_stay_desc: matched?.max_stay_desc || null,
        });

        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=0&pitch=10&radius=50&key=${apiKey}`;
        setImageUrl(streetViewUrl);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const userLocation = await Location.getCurrentPositionAsync({});
          const distance = haversineDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            lat,
            lng
          );
          setDistanceKm(distance.toFixed(2));

          const driveTime = await fetchDrivingTime(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            lat,
            lng
          );
          setDurationText(driveTime);
        }
      } catch (err) {
        console.error("Google Place + Calgary merge error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCalgaryParking = async () => {
      try {
        const res = await fetch(
          "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
        );
        const data = await res.json();

        const found = data.find(
          (item) =>
            item.globalid_guid === id ||
            `${item.permit_zone}-${item.address_desc}` === id
        );

        if (found) {
          setLot(found);
          const coords = found.the_geom?.coordinates?.[0]?.[0];
          if (Array.isArray(coords) && coords.length === 2) {
            const [lng, lat] = coords;
            const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=0&pitch=10&radius=50&key=${apiKey}`;
            setImageUrl(streetViewUrl);

            const { status } =
              await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
              const userLocation = await Location.getCurrentPositionAsync({});
              const distance = haversineDistance(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                lat,
                lng
              );
              setDistanceKm(distance.toFixed(2));

              const driveTime = await fetchDrivingTime(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                lat,
                lng
              );
              setDurationText(driveTime);
            }
          }
        } else {
          setLot(null);
        }
      } catch (err) {
        console.error("Calgary Parking Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (place_id) fetchFromGooglePlace();
    else if (id) fetchCalgaryParking();
    else if (lat && lng) fetchFromCoords(parseFloat(lat), parseFloat(lng));
    else setLoading(false);
  }, [id, place_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#609CFF" />
      </View>
    );
  }

  if (!lot || lot.address_desc?.includes("No matching")) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 100 }}>
          {lot?.address_desc ?? "Parking zone not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.name}>{lot.zone_type || "Parking Zone"}</Text>
        <Text style={styles.address}>
          {lot.address_desc || "Unknown address"}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location" size={16} />
          <Text style={styles.metaText}>
            {distanceKm ? `${distanceKm} km` : "Distance not available"}
          </Text>
          <Ionicons name="car" size={16} style={{ marginLeft: 16 }} />
          <Text style={styles.metaText}>
            {durationText || "Drive time not available"}
          </Text>
        </View>
      </View>

      <ParkingDetailCard lot={lot} />

      {/* <PlaceAbout
        overview={
          lot?.editorial_summary?.overview ??
          "No description from Google database available for this place."
        }
      /> */}

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() =>
          router.push({
            pathname: "/booking",
            params: {
              address_desc: lot?.address_desc,
              stall_id: lot?.stall_id ?? "A31",
              license_plate: "CST309",
              html_zone_rate: lot?.html_zone_rate,
              max_time: lot?.max_time,
              price_zone: lot?.price_zone,
            },
          })
        }
      >
        <Text style={styles.bookText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#BAD0FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  backText: { fontWeight: "600", marginLeft: 4 },
  card: {
    backgroundColor: "#f2f2f2",
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },
  name: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  address: { color: "#555", fontSize: 14 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaText: { fontSize: 13, marginLeft: 4 },
  infoBox: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
  },
  label: { fontWeight: "500" },
  value: { color: "#333" },
  bookBtn: {
    backgroundColor: "#609CFF",
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
