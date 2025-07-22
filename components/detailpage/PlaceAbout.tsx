// components/detailpage/PlaceAbout.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlaceAbout({ overview }: { overview?: string }) {
  if (!overview) return null; // Don't render if empty

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.text}>{overview}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
