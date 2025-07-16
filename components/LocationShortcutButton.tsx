import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle; // allow optional override
};

export default function LocationShortcutButton({
  label,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Ionicons name="location-outline" size={16} color="white" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84B4FF",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: "30%",
    maxWidth: "48%",
    margin: 4, // <-- adds spacing between buttons
    borderWidth: 1,
    borderColor: "#000", // white border
    zIndex: 1, // ensure it's above map
  },
  text: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 15,
  },
});
