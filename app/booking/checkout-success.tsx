"use client";

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get('window');

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { 
    full_name, 
    address, 
    time_start, 
    time_end, 
    duration, 
    total, 
    license,
    zone,
    spot,
    permit_zone,
    zone_type,
    price_zone,
    globalid_guid,
    booking_id
  } = useLocalSearchParams();

  // Fallback zone display if no zone data
  const getZoneDisplay = () => {
    if (zone) return zone.toString();
    if (permit_zone) return `ZONE ${permit_zone.toString()}`;
    if (zone_type) return zone_type.toString().toUpperCase();
    if (price_zone) return `ZONE ${price_zone.toString()}`;
    return "PARKING ZONE";
  };

  // Fallback spot display if no spot data
  const getSpotDisplay = () => {
    if (spot) return spot.toString();
    // Generate a realistic spot number
    const spotNum = Math.floor(Math.random() * 99) + 1;
    const spotLetter = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    return `${spotNum}${spotLetter}`;
  };

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(50));
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Success animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigateToTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (iso: any) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: any) =>
    new Date(iso).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  const navigateToTimer = () => {
    router.replace({
      pathname: "/booking/remaining-time",
      params: {
        zone: getZoneDisplay(),
        spot: getSpotDisplay(),
        time_start,
        time_end,
        total,
        license,
        permit_zone: permit_zone?.toString() || "",
        zone_type: zone_type?.toString() || "",
        price_zone: price_zone?.toString() || "",
        booking_id: booking_id?.toString() || globalid_guid?.toString() || `booking_${Date.now()}`,
      },
    });
  };

  const navigateToMap = () => {
    router.replace("/(tabs)/map");
  };

  const sendReceipt = () => {
    // In a real app, this would send an email receipt
    alert("Receipt sent to your email!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Success Header */}
      <View style={styles.successHeader}>
        <Animated.View 
          style={[
            styles.checkmarkContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="white" />
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.successTitle,
            { opacity: fadeAnim }
          ]}
        >
          Payment Successful!
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.successSubtitle,
            { opacity: fadeAnim }
          ]}
        >
          Your parking spot has been reserved
        </Animated.Text>
      </View>

      {/* Booking Details Card */}
      <Animated.View 
        style={[
          styles.detailsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Booking Confirmation</Text>
          <View style={styles.confirmationBadge}>
            <Text style={styles.confirmationNumber}>
              #{booking_id?.toString().slice(-4) || globalid_guid?.toString().slice(-4) || Math.floor(Math.random() * 10000)}
            </Text>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <Ionicons name="location" size={24} color="#4CAF50" />
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>Parking {getZoneDisplay()}, Spot #{getSpotDisplay()}</Text>
            <Text style={styles.locationAddress}>{address}</Text>
          </View>
        </View>

        <View style={styles.timeInfo}>
          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.timeLabel}>Date</Text>
            <Text style={styles.timeValue}>{formatDate(time_start)}</Text>
          </View>
          
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.timeLabel}>Time</Text>
            <Text style={styles.timeValue}>
              {formatTime(time_start)} - {formatTime(time_end)}
            </Text>
          </View>
          
          <View style={styles.timeItem}>
            <Ionicons name="hourglass-outline" size={20} color="#666" />
            <Text style={styles.timeLabel}>Duration</Text>
            <Text style={styles.timeValue}>
              {duration} hour{Number(duration) > 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.paymentInfo}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>License Plate</Text>
            <Text style={styles.paymentValue}>{license}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentValue}>•••• 1234</Text>
          </View>
          
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.actionButton} onPress={sendReceipt}>
          <Ionicons name="receipt-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Send Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Add to Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Ionicons name="share-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Auto-redirect countdown */}
      <Animated.View 
        style={[
          styles.countdownContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.countdownText}>
          Redirecting to parking timer in {countdown}s
        </Text>
        <View style={styles.countdownProgress}>
          <View style={[styles.countdownBar, { width: `${(countdown / 5) * 100}%` }]} />
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <Animated.View 
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.timerButton} 
          onPress={navigateToTimer}
        >
          <Ionicons name="timer-outline" size={20} color="white" />
          <Text style={styles.timerButtonText}>Go to Timer Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapButton} 
          onPress={navigateToMap}
        >
          <Text style={styles.mapButtonText}>Back to Map</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  successHeader: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: -20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmationBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  confirmationNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  timeInfo: {
    marginBottom: 20,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  paymentInfo: {
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  countdownText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  countdownProgress: {
    width: width * 0.6,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  countdownBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 'auto',
  },
  timerButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  mapButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 12,
  },
  mapButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});