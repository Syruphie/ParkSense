import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "/map/map", icon: "map", label: "map" },
  { name: "/booking", icon: "document-text", label: "booking" },
  { name: "/record", icon: "folder", label: "record" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.name;

        return (
          <Link key={tab.name} href={tab.name} asChild>
            <TouchableOpacity style={styles.tab}>
              <View
                style={[styles.innerTab, isActive && styles.activeInnerTab]}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={28}
                  color="#000"
                  style={styles.icon}
                />
                <Text style={styles.label}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 68,
    backgroundColor: "#BAD0FF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 99,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerTab: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 150,
    backgroundColor: "transparent", // default
  },
  activeInnerTab: {
    backgroundColor: "#84ABFF", // only this changes
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: "#000",
  },
});
