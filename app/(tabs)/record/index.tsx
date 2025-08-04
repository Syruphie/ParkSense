import type { Booking } from "@/lib/booking_crud";
import { getBookingsByUser } from "@/lib/booking_crud";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



const BookingCard = ({ booking }: { booking: Booking }) => {
  const router = useRouter();

  const {
    zone,
    time_start,
    total,
    duration,
    address,
    license,
    time_end,
    spot,
    booking_id,
    first_name,
    last_name,
  } = booking;

  const handlePress = () => {
    router.push({
      pathname: "/record/recording",
      params: {
        full_name: `${first_name} ${last_name}`,
        address,
        time_start,
        time_end,
        duration,
        total,
        license,
        zone,
        spot,
        booking_id,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.lotName}>{zone}</Text>
          <Text style={styles.date}>
            {time_start ? new Date(time_start).toLocaleDateString() : "Unknown"}
          </Text>
          <Text style={styles.price}>
            <Text style={{ color: "#1976D2", fontWeight: "bold" }}>
              ${total}
            </Text>{" "}
            / {duration}h
          </Text>
        </View>
        <Image
          source={{ uri: "https://source.unsplash.com/parking" }}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
};

export default function RecordScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const currentBooking = bookings[0];
  const previousBookings = bookings.slice(1);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) throw new Error("User not found");

        const userBookings = await getBookingsByUser(user.id);
        setBookings(userBookings);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to fetch bookings:", error.message);
        } else {
          console.error("Unknown error fetching bookings:", error);
        }
      }
    };

    fetchBookings();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Parking Record</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.sectionTitle}>Current Parking</Text>
        {currentBooking ? (
          <BookingCard booking={currentBooking} />
        ) : (
          <Text style={styles.noBooking}>No current booking</Text>
        )}

        <Text style={styles.sectionTitle}>Previous Parking</Text>
        {previousBookings && previousBookings.length > 0 ? (
          previousBookings.map((booking, idx) => (
            <BookingCard key={idx} booking={booking} />
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
    backgroundColor: "#84B4FF",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
