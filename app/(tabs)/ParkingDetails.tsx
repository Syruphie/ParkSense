import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ParkingDetails() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1616352553120-8632cf961af4",
        }}
        style={styles.image}
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backText}>Parking Details</Text>
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>CRA Lot 888</Text>
            <Text style={styles.subtitle}>
              109 Riverfront Ave SE, Calgary, AB T2G 0B3
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={14} color="#aaa" />
              <Ionicons name="star-outline" size={14} color="#aaa" />
              <Ionicons name="star-outline" size={14} color="#aaa" />
              <Text style={styles.grayText}>(98 reviews)</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="black" />
              <Text style={styles.detailText}>1.2km</Text>
              <Ionicons
                name="car"
                size={16}
                color="black"
                style={{ marginLeft: 10 }}
              />
              <Text style={styles.detailText}>7 Mins</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.goBtn}>
            <Ionicons name="navigate" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rate Table */}
      <View style={styles.table}>
        <Text style={styles.tableHeader}>Info</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Parking</Text>
          <Text style={styles.tableCellRight}>Per Hour</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Cost</Text>
          <Text style={styles.tableCellRight}>$7</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Max</Text>
          <Text style={styles.tableCellRight}>10 hour</Text>
        </View>
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Conveniently located near shops, restaurants, and office buildings,
          this outdoor lot offers 24/7 access with both hourly and daily rates.
          Well-lit and regularly patrolled, it features accessible spots, EV
          charging stations, and contactless payment options.
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  },
  backText: {
    fontWeight: "600",
    marginLeft: 4,
  },
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  grayText: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 6,
  },
  detailText: {
    fontSize: 13,
    marginLeft: 4,
  },
  goBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#84ABFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
  },
  tableCell: {
    fontWeight: "bold",
  },
  tableCellRight: {
    fontWeight: "600",
  },
  aboutSection: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
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
});
