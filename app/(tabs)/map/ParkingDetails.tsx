import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ParkingDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchLot = async () => {
      try {
        const response = await fetch(
          "https://data.calgary.ca/resource/45az-7kh9.json?$limit=1000"
        );
        const data = await response.json();

        const found = data.find((item: any) => {
          return (
            item.globalid_guid === id ||
            `${item.permit_zone}-${item.address_desc}` === id
          );
        });

        setLot(found || null);
      } catch (err) {
        console.error("Failed to fetch lot details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLot();
  }, [id]);

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

  const imageUrl =
    "https://images.unsplash.com/photo-1616352553120-8632cf961af4";

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backText}>Parking Details</Text>
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>{lot.zone_type ?? "Parking Zone"}</Text>
            <Text style={styles.subtitle}>{lot.address_desc ?? "Unknown"}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="black" />
              <Text style={styles.detailText}>
                {lot.price_zone ? `Zone ${lot.price_zone}` : "N/A"}
              </Text>
              <Ionicons
                name="time"
                size={16}
                color="black"
                style={{ marginLeft: 10 }}
              />
              <Text style={styles.detailText}>
                {lot.max_time ? `${lot.max_time} mins` : "N/A"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.goBtn}>
            <Ionicons name="navigate" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Info</Text>
        <Text style={styles.aboutText}>
          {lot.html_zone_rate
            ? lot.html_zone_rate.replace(/<[^>]+>/g, "\n").trim()
            : "No rate information available."}
        </Text>
      </View>

      {/* Book Now */}
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
    backgroundColor: "#f9f9f9",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 4 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  detailText: { fontSize: 13, marginLeft: 4 },
  goBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#84ABFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutSection: { padding: 16 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    whiteSpace: "pre-wrap",
  },
  bookBtn: {
    backgroundColor: "#609CFF",
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
