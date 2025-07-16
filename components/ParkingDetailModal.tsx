// components/ParkingDetailModal.tsx

import React from "react";
import {
  Image,
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
  onMoreDetail: () => void;
  name: string;
  address: string;
  imageUrl: string;
}

export default function ParkingDetailModal({
  visible,
  onClose,
  onMoreDetail,
  name,
  address,
  imageUrl,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text style={styles.title}>Details</Text>
              <View style={styles.divider} />

              <Image source={{ uri: imageUrl }} style={styles.image} />

              <Text style={styles.name}>{name}</Text>
              <Text style={styles.address}>{address}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.moreBtn} onPress={onMoreDetail}>
                  <Text style={styles.moreText}>More Detail</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f5f8ff",
    borderRadius: 16,
    padding: 16,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  moreBtn: {
    backgroundColor: "#84B4FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  moreText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelText: {
    color: "#84B4FF",
    fontWeight: "600",
  },
});
