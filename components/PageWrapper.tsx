// components/PageWrapper.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderUserIcon from "./HeaderUserIcon";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.iconWrapper}>
          <HeaderUserIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCDBFD",
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  iconWrapper: {
    padding: 8,
  },
  body: {
    flex: 1,
  },
});
