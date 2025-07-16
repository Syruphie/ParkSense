import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function FilterPopup({ visible, onClose }: Props) {
  const [distance, setDistance] = useState(45);
  const [selectedSort, setSelectedSort] = useState("Distance");
  const sortOptions = ["Distance", "Slots Available", "Price"];
  const screenWidth = Dimensions.get("window").width;
  const sliderWidth = screenWidth - 40; // account for padding
  const thumbRadius = 20;
  const thumbX =
    (distance / 100) * (sliderWidth - thumbRadius) + thumbRadius / 2;
  return (
    <Modal visible={visible} animationType="none" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.popup}>
              <Text style={styles.title}>Filter</Text>
              <View style={styles.divider} />

              {/* Sort By */}
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortRow}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.sortButton,
                      selectedSort === option && styles.selectedSort,
                    ]}
                    onPress={() => setSelectedSort(option)}
                  >
                    <Text
                      style={[
                        styles.sortText,
                        selectedSort === option && styles.selectedText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Distance */}
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.sliderContainer}>
                <View style={[styles.kmLabel, { left: thumbX - 15 }]}>
                  <Text style={styles.kmText}>{distance} km</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={distance}
                  onValueChange={setDistance}
                  minimumTrackTintColor="#84B4FF"
                  thumbTintColor="#84B4FF"
                />
              </View>

              <View style={styles.divider} />

              {/* Bottom Buttons */}
              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
                  <Text style={styles.applyText}>Apply Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => {
                    setDistance(45);
                    setSelectedSort("Distance");
                  }}
                >
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  popup: {
    backgroundColor: "#E9F1FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    minWidth: 100,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSort: {
    backgroundColor: "#84B4FF",
  },
  sortText: {
    color: "#84B4FF",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 15,
  },
  selectedText: {
    color: "white",
  },
  sliderContainer: {
    position: "relative",
    marginTop: 8,
    marginBottom: 30,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  kmLabel: {
    position: "absolute",
    top: -12,
    transform: [{ translateX: -25 }], // ✅ center label (half label width)

    width: 60,
    alignItems: "center",
  },
  kmText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 12,
    paddingHorizontal: 8,
  },
  applyBtn: {
    backgroundColor: "#84B4FF",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
  },
  applyText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  resetBtn: {
    backgroundColor: "white",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
  },
  resetText: {
    color: "#84B4FF",
    fontWeight: "600",
    fontSize: 15,
  },
});
