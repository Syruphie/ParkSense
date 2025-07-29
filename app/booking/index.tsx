"use client";

import ParkingDetailCard from "@/components/detailpage/ParkingDetailCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { extractHourlyRate } from "../types/calgary-parking";

export default function BookingPage() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  let localParams: Record<string, any> = {};
  try {
    localParams = useLocalSearchParams();
  } catch (e) {
    console.warn("Failed to get params", e);
  }

  if (Object.keys(localParams).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Missing Info</Text>
        <Text style={{ padding: 20 }}>
          Please navigate here from a valid parking lot.
        </Text>
      </View>
    );
  }

  const {
    address_desc: incomingAddress,
    stall_id: incomingStall,
    license_plate: incomingPlate,
    html_zone_rate,
    max_time,
    price_zone,
    permit_zone,
    zone_type,
    globalid_guid,
    rate_amount,
    rate_period_desc,
    max_stay_desc,
  } = localParams;

  const [addressDesc, setAddressDesc] = useState(
    incomingAddress?.toString() || ""
  );
  const [licensePlate, setLicensePlate] = useState(
    incomingPlate?.toString() || "CXT5530"
  );
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 3600000)
  );

  const HOURLY_RATE = extractHourlyRate({
    html_zone_rate: html_zone_rate?.toString(),
    rate_amount: rate_amount,
  });

  const calculateTotal = () => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.max(durationMs / (1000 * 60 * 60), 0);
    const roundedHours = Math.ceil(durationHours * 2) / 2;
    return {
      total: (roundedHours * HOURLY_RATE).toFixed(2),
      duration: roundedHours,
    };
  };

  const { total, duration } = calculateTotal();

  const generateSpotId = () => {
    if (incomingStall) return incomingStall.toString();
    const spotNum = Math.floor(Math.random() * 99) + 1;
    const spotLetter = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    return `${spotNum}${spotLetter}`;
  };

  const handleContinue = () => {
    router.push({
      pathname: "/booking/confirm-booking",
      params: {
        full_name: "Joy Wong",
        address: addressDesc ?? "",
        time_start: startTime.toISOString(),
        time_end: endTime.toISOString(),
        duration: duration.toString(),
        total: total.toString(),
        license: licensePlate,
        address_desc: addressDesc,
        permit_zone: permit_zone?.toString() || "",
        stall_id: generateSpotId(),
        zone_type: zone_type?.toString() || "",
        price_zone: price_zone?.toString() || "",
        globalid_guid: globalid_guid?.toString() || "",
        html_zone_rate: html_zone_rate?.toString() || "",
        max_time: max_time?.toString() || "",
        rate_amount: rate_amount?.toString() || "",
        rate_period_desc: rate_period_desc?.toString() || "",
        max_stay_desc: max_stay_desc?.toString() || "",
      },
    });
  };

  const lot = {
    html_zone_rate: html_zone_rate?.toString() || "",
    max_time: max_time,
    rate_amount: rate_amount,
    rate_period_desc: rate_period_desc,
    max_stay_desc: max_stay_desc,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking</Text>
      <ScrollView style={styles.formGroup} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.label}>Parking Lot</Text>
        {!incomingAddress ? (
          <GooglePlacesAutocomplete
            placeholder="Search for a parking lot"
            fetchDetails
            onPress={(data, details = null) => {
              setAddressDesc(data.description ?? "Unknown Location");
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "YOUR_BACKUP_API_KEY",
              language: "en",
              types: "establishment",
              keyword: "parking",
              location: "51.0447,-114.0719",
              radius: 3000,
            }}
            styles={{
              textInput: styles.input,
              listView: { backgroundColor: "#fff" },
            }}
            enablePoweredByContainer={false}
          />
        ) : (
          <View style={styles.locationContainer}>
            <Text style={[styles.input, { paddingVertical: 14 }]}>{addressDesc}</Text>
            {(permit_zone || zone_type || price_zone) && (
              <Text style={styles.zoneInfo}>
                Zone: {permit_zone || zone_type || price_zone}
                {rate_period_desc && ` • ${rate_period_desc}`}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.label}>License Plate</Text>
        <TextInput
          value={licensePlate}
          onChangeText={setLicensePlate}
          placeholder="Enter license plate"
          style={styles.input}
        />

        <Text style={styles.label}>Date</Text>
        <View style={styles.greyBox}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type === "set" && selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.label}>Start Time</Text>
            <View style={styles.greyBox}>
              <TouchableOpacity onPress={() => setShowStartTime(true)}>
                <Text>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
              {showStartTime && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowStartTime(false);
                    if (event.type === "set" && selectedTime) {
                      setStartTime(selectedTime);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.label}>End Time</Text>
            <View style={styles.greyBox}>
              <TouchableOpacity onPress={() => setShowEndTime(true)}>
                <Text>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
              {showEndTime && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowEndTime(false);
                    if (event.type === "set" && selectedTime) {
                      setEndTime(selectedTime);
                    }
                  }}
                />
              )}
            </View>
          </View>
        </View>

        {(html_zone_rate || rate_amount) && (
          <View style={{ marginTop: 12 }}>
            <ParkingDetailCard lot={lot} />
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${total}</Text>
          <Text style={styles.totalUnit}>/ {duration} hour{duration > 1 ? "s" : ""}</Text>
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    backgroundColor: "#92C3FF",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    color: "#fff",
    marginBottom: 20,
  },
  formGroup: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
    color: "#000",
  },
  locationContainer: {
    marginTop: 4,
  },
  zoneInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  greyBox: {
    backgroundColor: "#eee",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    paddingVertical: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timeBox: {
    flex: 1,
    marginRight: 10,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginVertical: 20,
  },
  totalLabel: {
    fontWeight: "bold",
    marginRight: 6,
  },
  totalPrice: {
    color: "#5C98FF",
    fontWeight: "bold",
    fontSize: 22,
  },
  totalUnit: {
    marginLeft: 6,
    fontSize: 16,
  },
  continueBtn: {
    backgroundColor: "#84B4FF",
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
