"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ParkingListPage() {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { place_id } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
        );
        const json = await res.json();
        console.log("🚗 Sample parking data:", json[0]);
        setParkingLots(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.backButtonText}>← Back to Map</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🚗 Calgary Parking Locations</Text>

      <FlatList
        data={parkingLots}
        keyExtractor={(item, index) =>
          item.globalid || item.objectid || index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/map/ParkingDetails?id=${item.globalid_guid ?? "unknown"}`
              )
            }
          >
            <Text style={styles.name}>
              {item.address_desc || "Unnamed Parking Area"}
            </Text>
            {item.parking_type && (
              <Text>Parking Type: {item.parking_type}</Text>
            )}
            {item.rate && <Text>Cost: {item.rate}</Text>}
            {item.max_time && <Text>Max Time: {item.max_time}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#E9F1FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  backButton: {
    backgroundColor: "#D0E8FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D4ED8",
  },
});
