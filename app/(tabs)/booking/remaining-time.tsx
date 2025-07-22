"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RemainingTimePage() {
  const router = useRouter();
  const { zone, spot, time_start, time_end } = useLocalSearchParams();

  const startDate = new Date(time_start?.toString() ?? "");
  const endDate = new Date(time_end?.toString() ?? "");

  const [remainingTime, setRemainingTime] = useState(() =>
    Math.max(endDate.getTime() - Date.now(), 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(endDate.getTime() - Date.now(), 0);
      setRemainingTime(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [time_end]);

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  const handleFinish = () => {
    Alert.alert("Parking session ended");
    router.replace("/(tabs)/map");
  };

  if (remainingTime <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Remaining Time</Text>
        <Text style={{ marginTop: 80, fontSize: 20, color: "#888" }}>
          Session has ended.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Remaining Time</Text>
      <View style={styles.clockIcon} />

      <Text style={styles.label}>Remaining time</Text>
      <Text style={styles.timer}>
        <Text style={styles.blueText}>{minutes}</Text> m :
        <Text style={styles.blueText}>
          {" "}
          {seconds < 10 ? "0" : ""}
          {seconds}
        </Text>{" "}
        s
      </Text>

      <Text style={styles.zoneText}>
        PARKING <Text style={styles.blueText}>{zone}</Text>, №{" "}
        <Text style={styles.blueText}>{spot}</Text>
      </Text>

      <Text style={styles.timeRange}>
        {startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
        <Text style={styles.finishText}>Finish</Text>
      </TouchableOpacity>

      <Text style={styles.renewDisabled}>Renew</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#337DFF",
    marginBottom: 20,
  },
  clockIcon: {
    width: 200,
    height: 200,
    backgroundColor: "#E6EDFF",
    borderRadius: 100,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  timer: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },
  blueText: {
    color: "#337DFF",
    fontWeight: "bold",
    fontSize: 28,
  },
  zoneText: {
    fontSize: 16,
    marginTop: 8,
  },
  timeRange: {
    fontSize: 16,
    color: "#333",
    marginVertical: 12,
  },
  finishBtn: {
    backgroundColor: "#82AEFF",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  finishText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  renewDisabled: {
    fontSize: 18,
    color: "#ccc",
    marginTop: 12,
    textShadowColor: "#999",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
