// app/confirm-booking.tsx
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

export default function ConfirmBookingPage() {
  const router = useRouter();
  const { full_name, address, time_start, time_end, duration, total, license } =
    useLocalSearchParams();

  const formatTime = (iso: any) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>Confirm Booking</Text> */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Full name:</Text>
          <Text style={styles.value}>{full_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {formatTime(time_start)} - {formatTime(time_end)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Period:</Text>
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
          <Text style={styles.applePayText}>Pay with  Pay</Text>
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
          onPress={() =>
            router.push({
              pathname: "/booking/remaining-time",
              params: {
                zone: "ZONE 1",
                spot: "32B",
                time_start: "2025-07-22T16:05:00.000Z",
                time_end: "2025-07-22T17:05:00.000Z",
              },
            })
          }
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#92C3FF",
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 20,
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
