import FilterPopup from "@/components/FilterPopup"; // ✅ adjust the import path as needed
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
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "CPA lot 888",
    "116 2 Ave SW parking",
    "202 centre st SE parking",
    "201 centre street sw -lot #253",
    "221 centre st s parking",
    "CPA lot 26",
  ]);

  const addToRecent = (searchTerm: string) => {
    setRecentSearches((prev) => {
      const updated = [
        searchTerm,
        ...prev.filter((item) => item !== searchTerm),
      ];
      return updated.slice(0, 10);
    });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_API_KEY}&components=country:ca`
      );

      const data = await response.json();

      if (data.status === "OK") {
        setResults(data.predictions);
      } else {
        console.warn("Google API error:", data.status);
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSelectResult = (place) => {
    addToRecent(place.description);
    router.push(`/map/ParkingDetails?place_id=${place.place_id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.push("/map")}
        style={styles.backBtn}
      >
        <Ionicons name="chevron-back" size={22} color="#333" />
        <Text style={styles.backText}>Search</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search location..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={22} color="white" />
        </TouchableOpacity>{" "}
        <TouchableOpacity style={styles.iconBtn} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={results.length > 0 ? results : recentSearches}
        keyExtractor={(item, index) =>
          typeof item === "string" ? index.toString() : item.place_id
        }
        renderItem={({ item }) =>
          typeof item === "string" ? (
            <TouchableOpacity onPress={() => setQuery(item)}>
              <Text style={styles.recentItem}>{item}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleSelectResult(item)}>
              <Text style={styles.recentItem}>{item.description}</Text>
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.recentList}
      />

      {/* Filter Popup Modal */}
      <FilterPopup
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginTop: 8,
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
    color: "#333",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F1FF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 12,
    height: 44,
    overflow: "hidden",
    paddingRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingLeft: 16,
  },
  iconBtn: {
    backgroundColor: "#84B4FF",
    borderRadius: 24,
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  recentList: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  recentItem: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingBottom: 6,
  },
});
