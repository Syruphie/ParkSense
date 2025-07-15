import BottomNav from "@/components/BottomNav";
import SearchPopup from "@/components/SearchPopup"; // adjust if path differs
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MapPage() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowSearch(true)}>
          <Ionicons name="search" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map</Text>
        <Image
          source={{
            uri: "https://i.pravatar.cc/100?img=12", // avatar placeholder
          }}
          style={styles.avatar}
        />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapArea}>
        <Text style={{ color: "#aaa" }}>Map goes here</Text>
      </View>

      {/* Search Popup */}
      <SearchPopup visible={showSearch} onClose={() => setShowSearch(false)} />

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

function QuickNav({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.navButton}>
      <Ionicons name="location-outline" size={16} color="white" />
      <Text style={styles.navText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#84B4FF",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
  },
  mapArea: {
    flex: 1,
    backgroundColor: "#f2f2f2", // simulate map background
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84B4FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
  },
});
