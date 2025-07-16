//this is old search popup component, we dont really use this in
// the figma design but i will keep it just in case

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SearchPopup({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Position popup in top-left, overlaying the search icon */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.popup}>
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search location..."
                  style={styles.input}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                  <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.quickBtns}>
                <Shortcut label="Home" />
                <Shortcut label="Office" />
                <Shortcut label="Recent Visit" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function Shortcut({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.shortcut}>
      <Ionicons name="location-outline" size={16} color="white" />
      <Text style={styles.shortcutText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)", // slight dark overlay
    alignItems: "flex-start",
    paddingTop: 50, // height to match your icon position
    paddingLeft: 20, // match left icon offset
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "90%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  iconBtn: {
    backgroundColor: "#84B4FF",
    borderRadius: 999,
    padding: 6,
  },
  quickBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  shortcut: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84B4FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  shortcutText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
});
