// app/confirm-booking.tsx - Updated to use helper functions
"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import our helper functions
import { addBooking } from "@/lib/booking_crud";
import { supabase } from "@/lib/supabase";
import { generateSpotNumber, getZoneDisplay } from "../types/calgary-parking";

export default function ConfirmBookingPage() {
  const router = useRouter();
  const {
    full_name,
    address,
    time_start,
    time_end,
    duration,
    total,
    license,
    // Add these new params from the API
    permit_zone,
    stall_id,
    zone_type,
    address_desc,
    price_zone,
    globalid_guid,
  } = useLocalSearchParams();

  const formatTime = (iso: any) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Use helper functions instead of local ones
  const lotData = {
    permit_zone,
    zone_type,
    price_zone,
    stall_id,
  };

  const zoneDisplay = getZoneDisplay(lotData);
  const spotNumber = generateSpotNumber(lotData);
  const { date } = useLocalSearchParams(); // already passed as ISO string

  const safeToString = (val: string | string[] | undefined): string =>
    Array.isArray(val) ? val[0] : val ?? "";

  const handleConfirmBooking = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        console.error("No user logged in");
        return;
      }

      const userId = user.id;

      // Fetch first_name and last_name from user_details table
      const { data: profile, error: profileError } = await supabase
        .from("user_details")
        .select("first_name, last_name")
        .eq("uuid", userId)
        .single();

      if (profileError || !profile) {
        console.error("Failed to fetch user details:", profileError?.message);
        return;
      }

      await addBooking({
        user_id: userId,
        first_name: profile.first_name,
        last_name: profile.last_name,
        license: safeToString(license),
        address: safeToString(address ?? address_desc),
        zone: getZoneDisplay(lotData),
        spot: generateSpotNumber(lotData),
        time_start: safeToString(time_start),
        time_end: safeToString(time_end),
        duration: parseFloat(safeToString(duration)),
        total: parseFloat(safeToString(total)),
        booking_date: new Date(safeToString(date)).toISOString().split("T")[0], // → 'YYYY-MM-DD'
      });

      router.replace("/booking/checkout-success");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving booking:", error.message);
      } else {
        console.error("Unknown error saving booking:", error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Full name:</Text>
          <Text style={styles.value}>{full_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{address_desc || address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Zone:</Text>
          <Text style={styles.value}>{zoneDisplay}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Spot:</Text>
          <Text style={styles.value}>#{spotNumber}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Booking Date:</Text>
          <Text style={styles.value}>
            {new Date(safeToString(date)).toDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {formatTime(time_start)} - {formatTime(time_end)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>
            {duration} hour{Number(duration) > 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>License:</Text>
          <Text style={styles.value}>{license}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Payment Type</Text>

        <TouchableOpacity style={styles.applePayBtn}>
          <Text style={styles.applePayText}>Pay with Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googlePayBtn}>
          <Text style={styles.googlePayText}>Pay with Google Pay</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalText}>
        <Text style={{ fontWeight: "bold" }}>Total:</Text> ${total} for{" "}
        {duration} hour{Number(duration) > 1 ? "s" : ""}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.btnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    flexGrow: 1,
  },
  card: {
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: "#444",
  },
  value: {
    fontWeight: "bold",
  },
  applePayBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applePayText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  googlePayBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  googlePayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelBtn: {
    backgroundColor: "#B4CEFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  confirmBtn: {
    backgroundColor: "#84B4FF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
