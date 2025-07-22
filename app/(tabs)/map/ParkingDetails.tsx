"use client";

import { Ionicons } from "@expo/vector-icons";
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

export default function ParkingDetails() {
  const router = useRouter();
  const { id, place_id } = useLocalSearchParams();
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(
    "https://via.placeholder.com/300x200"
  );

  useEffect(() => {
    const fetchFromGooglePlace = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`
        );
        const json = await res.json();
        const result = json.result;

        if (result) {
          const lat = result.geometry.location.lat;
          const lng = result.geometry.location.lng;
          const address = result.formatted_address;

          setLot({
            address_desc: address,
            zone_type: result.types?.[0] || "Point of Interest",
            rate_amount: null,
            rate_period_desc: "",
            max_stay_desc: "",
            the_geom: {
              coordinates: [[[{ 1: lat, 0: lng }]]],
            },
          });

          const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=0&pitch=10&radius=50&key=${apiKey}`;
          setImageUrl(streetViewUrl);
        }
      } catch (err) {
        console.error("Google Place Details error:", err);
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
          (item: any) =>
            item.globalid_guid === id ||
            `${item.permit_zone}-${item.address_desc}` === id
        );

        if (found) {
          setLot(found);

          const coords = found.the_geom?.coordinates?.[0]?.[0];
          if (coords?.length === 2 && apiKey) {
            const [lng, lat] = coords;
            const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=80&heading=0&pitch=10&radius=50&key=${apiKey}`;
            setImageUrl(streetViewUrl);
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

    if (place_id) {
      fetchFromGooglePlace();
    } else if (id) {
      fetchCalgaryParking();
    } else {
      setLoading(false);
    }
  }, [id, place_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#609CFF" />
      </View>
    );
  }

  if (!lot) {
    return (
      <View style={styles.center}>
        <Text>Parking zone not found.</Text>
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
            {lot.the_geom?.coordinates?.[0]?.[0]?.length === 2 ? (
              <Text style={styles.metaText}>
                Lat/Lng: {lot.the_geom.coordinates[0][0][1].toFixed(5)},{" "}
                {lot.the_geom.coordinates[0][0][0].toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.metaText}>Coordinates not available</Text>
            )}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Parking</Text>
          <Text style={styles.value}>
            {lot.rate_period_desc?.toLowerCase().includes("hour")
              ? "Per Hour"
              : lot.rate_period_desc?.toLowerCase().includes("day")
              ? "Per Day"
              : "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cost</Text>
          <Text style={styles.value}>
            {lot.rate_amount
              ? `$${parseFloat(lot.rate_amount).toFixed(2)}`
              : "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Max</Text>
          <Text style={styles.value}>{lot.max_stay_desc || "N/A"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bookBtn}>
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
