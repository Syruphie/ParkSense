import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";

export default function HeaderUserIcon() {
  const router = useRouter();

  // Redirect to tabs if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)");
      }
    });
  }, []);

  const handlePress = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            router.push("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 16 }}>
      <FontAwesome name="user-circle" size={42} color="#84B4FF" />
    </TouchableOpacity>
  );
}
