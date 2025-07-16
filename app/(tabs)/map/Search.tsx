"use client";

import FilterPopup from "@/components/FilterPopup"; // make sure this is correctly imported
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const recentSearches = [
  "CPA lot 888",
  "116 2 Ave SW parking",
  "202 centre st SE parking",
  "201 centre street sw -lot #253",
  "221 centre st s parking",
  "CPA lot 26",
];

export default function SearchPage() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push("/map/map")}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search location..."
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
        <View style={styles.iconGroup}>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name="funnel-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Recent Searches */}
      <Text style={styles.recentTitle}>Recent</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.recentItem}>{item}</Text>}
        contentContainerStyle={styles.recentList}
      />

      <FilterPopup visible={showFilter} onClose={() => setShowFilter(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: {
    paddingRight: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F1FF",
    borderRadius: 24,
    marginHorizontal: 16,
    height: 44,
    overflow: "hidden",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingLeft: 16,
  },

  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 0, // add padding here instead
    paddingLeft: 34,
  },
  filterIcon: {
    padding: 6,
    marginRight: 6,
  },
  searchIcon: {
    backgroundColor: "#84B4FF",
    borderRadius: 24,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  recentList: {
    paddingHorizontal: 24, // shifted right from 16 to 24
  },
  recentItem: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
});
