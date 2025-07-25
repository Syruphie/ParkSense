// app/components/LoginScreen.tsx - Updated with DB insert on SignUp
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginButtonPressed, setLoginButtonPressed] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
        return;
      }

      const user = data.user;
      console.log("User logged in:", user);

      const isFirstNameMissing = !user.user_metadata?.first_name;
      const isLastNameMissing = !user.user_metadata?.last_name;

      if (isFirstNameMissing || isLastNameMissing) {
        const { data: profile, error: profileError } = await supabase
          .from("user_details")
          .select("FirstName, LastName")
          .eq("uuid", user.id)
          .single();

        if (profileError) {
          console.warn("Could not fetch user profile:", profileError.message);
        } else {
          const updatedFirstName = profile.FirstName;
          const updatedLastName = profile.LastName;

          if (updatedFirstName || updatedLastName) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                ...(updatedFirstName && { first_name: updatedFirstName }),
                ...(updatedLastName && { last_name: updatedLastName }),
              },
            });

            if (updateError) {
              console.warn(
                "Failed to update user metadata:",
                updateError.message
              );
            } else {
              console.log("User metadata updated successfully");
            }
          }
        }
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        Alert.alert("Sign-up failed", error.message);
        return;
      }

      if (data?.user) {
        const { id } = data.user;

        const { error: insertError } = await supabase
          .from("user_details")
          .insert({
            uuid: id,
            FirstName: firstName,
            LastName: lastName,
          });

        if (insertError) {
          console.warn("Failed to insert user details:", insertError.message);
        } else {
          console.log("User details inserted to user_details table");
        }
      }

      Alert.alert(
        "Success",
        "Account created! Please confirm your email before logging in.",
        [
          {
            text: "OK",
            onPress: () => setIsSignUp(false),
          },
        ],
        { cancelable: true }
      );
    } catch (err) {
      Alert.alert(
        "Unexpected Error",
        "Something went wrong. Please try again."
      );
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email address first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        Alert.alert("Reset Password Error", error.message);
      } else {
        Alert.alert("Success", "Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... UI remains unchanged
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#CCDBFD" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require("../assets/images/ParkSense-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Login/Sign Up Form */}
          <View style={styles.formContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
                onPress={() => setIsSignUp(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isSignUp && styles.activeToggleText,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, isSignUp && styles.activeToggle]}
                onPress={() => setIsSignUp(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isSignUp && styles.activeToggleText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.disabledButton,
                loginButtonPressed && styles.loginButtonPressed,
              ]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              onPressIn={() => setLoginButtonPressed(true)}
              onPressOut={() => setLoginButtonPressed(false)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isSignUp ? "Create Account" : "Login"}
                </Text>
              )}
            </TouchableOpacity>

            {!isSignUp && (
              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => setIsSignUp(true)}>
                  <Text style={styles.linkText}>Create Account</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.linkText}>Forgot password</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.guestButtonText}>Continue as a guest</Text>
            </TouchableOpacity>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Database for the login is the same as assignment 4
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCDBFD",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    minHeight: 200,
  },
  logo: {
    width: 600,
    height: 250,
    marginBottom: 20,
  },
  carsContainer: {
    position: "relative",
    width: 200,
    height: 150,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#84B4FF",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonPressed: {
    backgroundColor: "#6B9EFF",
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  linkText: {
    color: "#333",
    fontSize: 14,
  },
  guestButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  guestButtonText: {
    color: "#666",
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleText: {
    color: "#333",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  noteContainer: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    alignItems: "center",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
});
