// app/(tabs)/index.tsx - Landing Page (Home Tab)
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const navigateToMap = () => {
    router.push('/(tabs)/map');
  };

  const navigateToBooking = () => {
    router.push('/(tabs)/booking');
  };

  const navigateToRecords = () => {
    router.push('/(tabs)/record');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#CCDBFD" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/ParkSense-Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome to ParkSense!</Text>
          <Text style={styles.subtitleText}>Find and book parking spots with ease</Text>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToMap}>
            <View style={styles.iconContainer}>
              <Ionicons name="map" size={40} color="#84B4FF" />
            </View>
            <Text style={styles.actionTitle}>Find Parking</Text>
            <Text style={styles.actionDescription}>
              Discover available parking spots near you
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToBooking}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar" size={40} color="#84B4FF" />
            </View>
            <Text style={styles.actionTitle}>My Bookings</Text>
            <Text style={styles.actionDescription}>
              View and manage your parking reservations
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToRecords}>
            <View style={styles.iconContainer}>
              <Ionicons name="list" size={40} color="#84B4FF" />
            </View>
            <Text style={styles.actionTitle}>Parking History</Text>
            <Text style={styles.actionDescription}>
              Review your past parking sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why Choose ParkSense?</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="search" size={24} color="#84B4FF" />
            <Text style={styles.featureText}>Real-time parking availability</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="card" size={24} color="#84B4FF" />
            <Text style={styles.featureText}>Secure mobile payments</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#84B4FF" />
            <Text style={styles.featureText}>Smart parking reminders</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="star" size={24} color="#84B4FF" />
            <Text style={styles.featureText}>Rate and review parking spots</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={navigateToMap}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCDBFD',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 70,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F8FF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: '#84B4FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
});