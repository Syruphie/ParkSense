import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MapLabelBubble({ label = "Parking Spot" }) {
  return (
    <View style={styles.bubble}>
      <Ionicons name="location-outline" size={16} color="white" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    backgroundColor: "#84B4FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
});
