import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ParkingDetails() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Image */}
        <Image
          source={{ uri: "https://i.imgur.com/YOUR_IMAGE_ID.jpg" }}
          style={styles.image}
        />

        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#000" />
          <Text style={styles.backText}>Parking Details</Text>
        </Pressable>

        {/* Title Card */}
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.lotName}>CRA Lot 888</Text>
            <Text style={styles.address}>
              109 Riverfront Ave SE, Calgary, AB T2G 0B3
            </Text>
            <View style={styles.statsRow}>
              <Text style={styles.rating}>4.8</Text>
              <Ionicons name="star-outline" size={16} color="gray" />
              <Ionicons name="star-outline" size={16} color="gray" />
              <Ionicons name="star-outline" size={16} color="gray" />
              <Text style={styles.reviewText}>(98 reviews)</Text>
            </View>
            <View style={styles.statsRow}>
              <Ionicons name="location-outline" size={16} color="black" />
              <Text style={styles.meta}>1.2km</Text>
              <Ionicons
                name="car-outline"
                size={16}
                color="black"
                style={{ marginLeft: 10 }}
              />
              <Text style={styles.meta}>7 Mins</Text>
            </View>
          </View>
          <View style={styles.navIcon}>
            <Ionicons name="navigate" size={24} color="#fff" />
          </View>
        </View>

        {/* Info Section */}
        <Text style={styles.sectionTitle}>Info</Text>
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parking</Text>
            <Text style={styles.infoValue}>Per Hour</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cost</Text>
            <Text style={styles.infoValue}>$7</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max</Text>
            <Text style={styles.infoValue}>10 hour</Text>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Conveniently located near shops, restaurants, and office buildings,
          this outdoor lot offers 24/7 access with both hourly and daily rates.
          Well-lit and regularly patrolled, it features accessible spots, EV
          charging stations, and contactless payment options. Conveniently
          located near shops, restaurants, and office buildings, this outdoor
          lot offers 24/7 access with both hourly and daily rates.
        </Text>

        {/* Book Button */}
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingBottom: 80 },
  image: { width: "100%", height: 200 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    flexDirection: "row",
    backgroundColor: "#BAD0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backText: { fontWeight: "bold", fontSize: 14, marginLeft: 6 },
  card: {
    margin: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
  },
  lotName: { fontSize: 18, fontWeight: "bold" },
  address: { fontSize: 14, color: "#555", marginVertical: 4 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { marginRight: 4, fontSize: 14 },
  reviewText: { marginLeft: 6, fontSize: 13, color: "#888" },
  meta: { fontSize: 13, marginLeft: 4 },
  navIcon: {
    backgroundColor: "#84ABFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 4,
  },
  infoTable: {
    marginHorizontal: 16,
    backgroundColor: "#f6f6f6",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  infoLabel: { fontWeight: "bold", fontSize: 14 },
  infoValue: { fontSize: 14 },
  aboutText: {
    margin: 16,
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  bookBtn: {
    backgroundColor: "#84ABFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
