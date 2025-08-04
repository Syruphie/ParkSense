// app/booking/confirm-booking.tsx - FIXED VERSION
"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import our helper functions
import { supabase } from "@/lib/supabase";
import { generateSpotNumber, getZoneDisplay } from "../types/calgary-parking";

export default function ConfirmBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    date,
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

  const safeToString = (val: string | string[] | undefined): string =>
    Array.isArray(val) ? val[0] : val ?? "";

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Login Required",
          "You must be logged in to make a booking.",
          [
            {
              text: "Go to Login",
              onPress: () => router.push("/login"),
              style: "default",
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]
        );
        return;
      }

      console.log("User ID:", user.id);

      // Use name from form params or auth metadata (skip database lookup for now)
      const firstName = user.user_metadata?.first_name || "Test";
      const lastName = user.user_metadata?.last_name || "User";

      console.log("Using name:", firstName, lastName);

      // Mock payment process
      Alert.alert("🧪 Mock Payment", `Simulating payment for $${total}`, [
        {
          text: "❌ Simulate Failure",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Payment Failed",
              "This is a simulated payment failure for testing."
            );
          },
        },
        // Inside handleConfirmBooking > under '✅ Simulate Success'
        {
          text: "✅ Simulate Success",
          onPress: async () => {
            // ✅ Move the insert INSIDE this function
            const { error: insertError } = await supabase
              .from("bookings")
              .insert({
                user_id: user.id,
                first_name: firstName,
                last_name: lastName,
                address: safeToString(address_desc || address),
                time_start: safeToString(time_start),
                time_end: safeToString(time_end),
                duration: Number(duration),
                total: Number(total),
                license: safeToString(license),
                zone: zoneDisplay,
                spot: spotNumber,
                booking_date: safeToString(date),
              });

            if (insertError) {
              console.error("Insert failed:", insertError.message);
              Alert.alert(
                "Booking Failed",
                "Could not save booking. Please try again."
              );
              return;
            }

            // Proceed only after successful insert
            proceedToSuccess({ first_name: firstName, last_name: lastName });
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error in handleConfirmBooking:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const proceedToSuccess = (profile: any) => {
    // Navigate to success page with all the data
    router.push({
      pathname: "/booking/checkout-success",
      params: {
        full_name: `${profile.first_name} ${profile.last_name}`.trim(),
        address: safeToString(address_desc || address),
        time_start: safeToString(time_start),
        time_end: safeToString(time_end),
        duration: safeToString(duration),
        total: safeToString(total),
        license: safeToString(license),
        zone: zoneDisplay,
        spot: spotNumber,
        permit_zone: safeToString(permit_zone),
        zone_type: safeToString(zone_type),
        price_zone: safeToString(price_zone),
        globalid_guid: safeToString(globalid_guid),
        booking_id: `MOCK${Math.floor(Math.random() * 100000)}`,
        booking_date: safeToString(date),
      },
    });
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

        {date && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Booking Date:</Text>
            <Text style={styles.value}>
              {new Date(safeToString(date)).toDateString()}
            </Text>
          </View>
        )}

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
        <Text style={styles.sectionTitle}>🧪 Mock Payment Options</Text>

        <TouchableOpacity
          style={[styles.applePayBtn, loading && styles.disabledBtn]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          <Text style={styles.applePayText}>🧪 Test Apple Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.googlePayBtn, loading && styles.disabledBtn]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          <Text style={styles.googlePayText}>🧪 Test Google Pay</Text>
        </TouchableOpacity>

        <View style={styles.mockWarning}>
          <Text style={styles.mockWarningText}>
            💡 No real payments will be processed in test mode
          </Text>
        </View>
      </View>

      <Text style={styles.totalText}>
        <Text style={{ fontWeight: "bold" }}>Total:</Text> ${total} for{" "}
        {duration} hour{Number(duration) > 1 ? "s" : ""}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.disabledBtn]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.btnText}>Confirm Booking</Text>
          )}
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
    borderWidth: 1,
    borderColor: "#ddd",
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
    marginBottom: 12,
  },
  googlePayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  mockWarning: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  mockWarningText: {
    fontSize: 12,
    color: "#2E7D32",
    textAlign: "center",
    fontStyle: "italic",
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
    minWidth: 120,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
