import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ParkingDetailCard({ lot }) {
  const parseHtmlRate = (html) => {
    const regex = /<b>(.*?)<\/b><br><br>\$?([\d.]+)?(?: per Hour)?/gi;
    const entries = [];
    let match;

    while ((match = regex.exec(html))) {
      const dayTime = match[1];
      const rawRate = match[2];

      // Skip "Free" or empty price blocks
      if (!rawRate || parseFloat(rawRate) === 0) continue;

      const rate = `$${parseFloat(rawRate).toFixed(2)}`;
      entries.push({ dayTime, rate });
    }

    return entries;
  };
  const parsedRates = parseHtmlRate(lot.html_zone_rate || "");
  const maxStay = lot.max_time
    ? `${(parseFloat(lot.max_time) / 60).toFixed(1)} hours`
    : "N/A";

  return (
    <View style={styles.infoBox}>
      <Text style={styles.sectionTitle}>Parking Rates</Text>
      {parsedRates.length > 0 ? (
        parsedRates.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>{item.dayTime}</Text>
            <Text style={styles.value}>{item.rate}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>No rate info, default $0</Text>
      )}

      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={styles.label}>Max Parking Time</Text>
        <Text style={styles.value}>{maxStay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
  },
  label: {
    fontWeight: "500",
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#222",
    flexShrink: 0,
    marginLeft: 10,
  },
});
