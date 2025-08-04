import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

export default function HeaderUserIcon() {
  const router = useRouter();
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.warn("No session found. Possibly guest user.");
        setUserFirstName(null);
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("Failed to fetch user:", error?.message);
        setUserFirstName(null);
        return;
      }

      console.log("SESSION OBJECT:", session);
      console.log("USER METADATA:", data.user.user_metadata);

      const firstName = data.user.user_metadata?.first_name;

      if (firstName) {
        setUserFirstName(firstName);
      } else {
        console.log("Authenticated but first_name missing in metadata");
        setUserFirstName(null);
      }
    };

    fetchUser();
  }, []);

  const handlePress = () => {
    if (userFirstName) {
      // Logged-in user
      Alert.alert(
        `Logging Out? ${userFirstName}`,
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Log Out",
            style: "destructive",
            onPress: async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Logout failed:", error.message);
                Alert.alert("Error", "Failed to log out. Please try again.");
              } else {
                console.log("Logout successful. Redirecting to login...");
                router.replace("/login");
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // Guest
      Alert.alert(
        "Guest Mode",
        "You're browsing as a guest. Would you like to go to the login page?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to Login",
            onPress: () => {
              console.log("Guest returning to login screen");
              router.replace("/login");
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 16 }}>
      <FontAwesome name="user-circle" size={42} color="#84B4FF" />
    </TouchableOpacity>
  );
}
