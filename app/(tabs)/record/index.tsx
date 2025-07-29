import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Dummy context for bookings (replace with your actual context/store)
const BookingContext = React.createContext({
  currentBooking: {
    lotName: "CRA Lot 888",
    date: "January 1, 2022",
    price: 7,
    duration: "1 hour",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  previousBookings: [
    {
      lotName: "CRA Lot 101",
      date: "July 26, 2025",
      price: 5,
      duration: "1.5 hours",
      image:
        "https://images.unsplash.com/photo-1589712235271-fbc3623f7978?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Downtown Lot A",
      date: "July 24, 2025",
      price: 8,
      duration: "2 hours",
      image:
        "https://images.unsplash.com/photo-1597164316963-d46e33c9b8ab?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Lot 33 - 9th Ave",
      date: "July 21, 2025",
      price: 6,
      duration: "1 hour",
      image:
        "https://images.unsplash.com/photo-1526234354934-b55d67e5d2cd?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Underground Lot Z",
      date: "July 18, 2025",
      price: 9,
      duration: "2.5 hours",
      image:
        "https://images.unsplash.com/photo-1608229827350-9b94116b8d67?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Lot 202 - Kensington",
      date: "July 16, 2025",
      price: 4,
      duration: "0.5 hours",
      image:
        "https://images.unsplash.com/photo-1604079628045-18bde45e3b24?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Eastside Parking",
      date: "July 14, 2025",
      price: 7,
      duration: "1 hour",
      image:
        "https://images.unsplash.com/photo-1521208919966-918b0485f550?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "CRA Lot 888",
      date: "July 12, 2025",
      price: 7,
      duration: "1 hour",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      lotName: "Lot B - 5th Street",
      date: "July 10, 2025",
      price: 6,
      duration: "1 hour",
      image:
        "https://images.unsplash.com/photo-1506377742300-b2de9c807dfa?auto=format&fit=crop&w=400&q=80",
    },
  ],
});

const BookingCard = ({ lotName, date, price, duration, image }: any) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/record/recording",
      params: {
        full_name: "John Doe",
        address: "123 Parking Street",
        time_start: new Date().toISOString(),
        time_end: new Date(Date.now() + 3600000).toISOString(),
        duration:
          typeof duration === "string" ? parseFloat(duration) || 1 : duration,
        total: price,
        license: "AB-1234",
        zone: lotName,
        spot: "17B",
        permit_zone: "A1",
        zone_type: "public",
        price_zone: "Z2",
        globalid_guid: `guid_${Date.now()}`,
        booking_id: `booking_${Date.now()}`,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.lotName}>{lotName}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.price}>
            <Text style={{ color: "#1976D2", fontWeight: "bold" }}>
              ${price}
            </Text>{" "}
            / {duration}
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};

export default function RecordScreen() {
  const { currentBooking, previousBookings } = useContext(BookingContext);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Parking Record</Text>
        {/* <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.avatar}
        /> */}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Current Parking */}
        <Text style={styles.sectionTitle}>Current Parking</Text>
        {currentBooking ? (
          <BookingCard {...currentBooking} />
        ) : (
          <Text style={styles.noBooking}>No current booking</Text>
        )}

        {/* Previous Parking */}
        <Text style={styles.sectionTitle}>Previous Parking</Text>
        {previousBookings && previousBookings.length > 0 ? (
          previousBookings.map((booking, idx) => (
            <BookingCard key={idx} {...booking} />
          ))
        ) : (
          <Text style={styles.noBooking}>No previous bookings</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#90CAF9",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#1976D2",
  },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lotName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  date: { color: "#555", marginBottom: 4 },
  price: { fontSize: 16 },
  image: { width: 100, height: 60, borderRadius: 8, marginLeft: 12 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#BBDEFB",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#90CAF9",
  },
  navItem: { alignItems: "center", flex: 1, paddingVertical: 4 },
  navIcon: { fontSize: 24 },
  navLabel: { fontSize: 12, color: "#333" },
  activeNav: { backgroundColor: "#90CAF9", borderRadius: 8 },
  noBooking: { textAlign: "center", color: "#888", marginBottom: 16 },
});
