"use client";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import our types
import { TimerParams } from "../types/calgary-parking";

const { width } = Dimensions.get("window");

export default function EnhancedRemainingTimePage() {
  const router = useRouter();
  const params = useLocalSearchParams() as TimerParams;

  // Destructure from params
  const {
    zone,
    spot,
    time_start,
    time_end,
    total,
    license,
    permit_zone,
    zone_type,
    price_zone,
    booking_id,
  } = params;

  // Fallback zone display if no zone data
  const getZoneDisplay = () => {
    if (zone) return zone.toString();
    if (permit_zone) return `ZONE ${permit_zone.toString()}`;
    if (zone_type) return zone_type.toString().toUpperCase();
    if (price_zone) return `ZONE ${price_zone.toString()}`;
    return "PARKING ZONE";
  };

  // Fallback spot display if no spot data
  const getSpotDisplay = () => {
    if (spot) return spot.toString();
    // Generate a realistic spot number
    const spotNum = Math.floor(Math.random() * 99) + 1;
    const spotLetter = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    return `${spotNum}${spotLetter}`;
  };

  const startDate = new Date(time_start?.toString() ?? "");
  const endDate = new Date(time_end?.toString() ?? "");
  const totalDuration = endDate.getTime() - startDate.getTime();

  const [remainingTime, setRemainingTime] = useState(() =>
    Math.max(endDate.getTime() - Date.now(), 0)
  );
  const [originalEndTime, setOriginalEndTime] = useState(endDate); // Track original end time
  const [currentEndTime, setCurrentEndTime] = useState(endDate); // Track current end time (after extensions)
  const [totalExtended, setTotalExtended] = useState(0); // Track total minutes extended

  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressWidth] = useState(new Animated.Value(100));

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(currentEndTime.getTime() - Date.now(), 0); // Use currentEndTime
      setRemainingTime(timeLeft);

      // Update progress bar
      const progress = (timeLeft / totalDuration) * 100;
      Animated.timing(progressWidth, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEndTime, totalDuration]); // Add currentEndTime to dependencies

  useEffect(() => {
    // Pulse animation for low time warning
    if (remainingTime < 600000) {
      // Less than 10 minutes
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [remainingTime < 600000]);

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const progress = remainingTime / totalDuration;
  const isLowTime = remainingTime < 600000; // 10 minutes
  const isCriticalTime = remainingTime < 300000; // 5 minutes

  const getTimeColor = () => {
    if (isCriticalTime) return "#FF4444";
    if (isLowTime) return "#FF8800";
    return "#337DFF";
  };

  const getProgressColor = () => {
    if (progress > 0.5) return "#4CAF50";
    if (progress > 0.25) return "#FF9800";
    return "#F44336";
  };

  const handleFinish = () => {
    Alert.alert(
      "End Parking Session",
      "Are you sure you want to end your parking session early?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Session Ended",
              "Your parking session has been completed."
            );
            router.replace("/(tabs)/map");
          },
        },
      ]
    );
  };

  const handleExtend = () => {
    Alert.alert(
      "Extend Parking",
      "Would you like to extend your parking session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Extend +30min ($3.50)",
          onPress: () => extendTime(30, 3.5),
        },
        {
          text: "Extend +1hr ($7.00)",
          onPress: () => extendTime(60, 7.0),
        },
      ]
    );
  };

  const extendTime = (minutes: number, cost: number) => {
    const newEndTime = new Date(currentEndTime.getTime() + minutes * 60 * 1000);
    setCurrentEndTime(newEndTime);
    setTotalExtended((prev) => prev + minutes);

    Alert.alert(
      "⏰ Time Extended!",
      `Your parking has been extended by ${minutes} minutes.\n\nNew end time: ${newEndTime.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}\n\nAdditional cost: $${cost.toFixed(2)}`,
      [{ text: "Great!" }]
    );
  };

  const handleFindCar = () => {
    Alert.alert("Find My Car", "Opening navigation to your parked location...");
  };

  const handleReceipt = () => {
    Alert.alert("Receipt", "Sending receipt to your email...");
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing parking details...");
  };

  if (remainingTime <= 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
        <View style={styles.expiredContainer}>
          <Ionicons name="time" size={80} color="#FF4444" />
          <Text style={styles.expiredTitle}>Session Expired</Text>
          <Text style={styles.expiredText}>Your parking session has ended</Text>
          <TouchableOpacity
            style={styles.newSessionBtn}
            onPress={() => router.replace("/(tabs)/map")}
          >
            <Text style={styles.newSessionText}>Find New Parking</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Ionicons name="chevron-back" size={24} color="#337DFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Parking</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="notifications-outline" size={24} color="#337DFF" />
        </TouchableOpacity>
      </View>

      {/* Timer Circle */}
      <View style={styles.timerCircleContainer}>
        <View style={styles.timerCircle}>
          <Animated.View
            style={[
              styles.timerInner,
              {
                backgroundColor: getProgressColor(),
                opacity: 0.1,
              },
            ]}
          />
          <View style={styles.timerContent}>
            <Animated.Text
              style={[
                styles.timerText,
                {
                  color: getTimeColor(),
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {hours > 0
                ? `${hours}:${displayMinutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                : `${displayMinutes}:${seconds.toString().padStart(2, "0")}`}
            </Animated.Text>
            <Text style={styles.timerLabel}>
              {hours > 0 ? "hours remaining" : "minutes remaining"}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% remaining
          </Text>
        </View>
      </View>

      {/* Extended Time Indicator */}
      {totalExtended > 0 && (
        <View style={styles.extendedNotice}>
          <Ionicons name="time" size={16} color="#4CAF50" />
          <Text style={styles.extendedNoticeText}>
            Extended by {totalExtended} minutes
          </Text>
        </View>
      )}

      {/* Warning Messages */}
      {isLowTime && (
        <View
          style={[
            styles.warningContainer,
            isCriticalTime && styles.criticalWarning,
          ]}
        >
          <Ionicons
            name={isCriticalTime ? "warning" : "time"}
            size={20}
            color={isCriticalTime ? "#FF4444" : "#FF8800"}
          />
          <Text
            style={[styles.warningText, isCriticalTime && styles.criticalText]}
          >
            {isCriticalTime ? "Time is running out!" : "Low time remaining"}
          </Text>
        </View>
      )}

      {/* Parking Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Parking Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>
            Parking {getZoneDisplay()}, Spot #{getSpotDisplay()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>License Plate</Text>
          <Text style={styles.detailValue}>{license}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Session Time</Text>
          <Text style={styles.detailValue}>
            {startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {currentEndTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {currentEndTime.getTime() !== originalEndTime.getTime() && (
              <Text style={styles.extendedIndicator}> (Extended)</Text>
            )}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Paid</Text>
          <Text style={[styles.detailValue, styles.priceText]}>${total}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.extendBtn} onPress={handleExtend}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.extendText}>Extend Time</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Ionicons name="stop-circle-outline" size={20} color="white" />
          <Text style={styles.finishText}>End Session</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={handleFindCar}>
          <Ionicons name="car-outline" size={24} color="#337DFF" />
          <Text style={styles.quickActionText}>Find My Car</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction} onPress={handleReceipt}>
          <Ionicons name="receipt-outline" size={24} color="#337DFF" />
          <Text style={styles.quickActionText}>Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#337DFF" />
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  timerCircleContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E6EDFF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  timerContent: {
    alignItems: "center",
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timerLabel: {
    fontSize: 14,
    color: "#666",
  },
  progressBarContainer: {
    width: width * 0.8,
    alignItems: "center",
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  extendedNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  extendedNoticeText: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  criticalWarning: {
    backgroundColor: "#FFEBEE",
  },
  warningText: {
    color: "#FF8800",
    fontWeight: "600",
    marginLeft: 8,
  },
  criticalText: {
    color: "#FF4444",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  priceText: {
    color: "#337DFF",
    fontSize: 16,
  },
  extendedIndicator: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  extendBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  extendText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  finishBtn: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  finishText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  quickAction: {
    alignItems: "center",
    padding: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: "#337DFF",
    marginTop: 5,
    fontWeight: "500",
  },
  expiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  expiredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4444",
    marginTop: 20,
    marginBottom: 10,
  },
  expiredText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  newSessionBtn: {
    backgroundColor: "#337DFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  newSessionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
