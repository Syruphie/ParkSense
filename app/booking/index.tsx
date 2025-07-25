"use client";

import ParkingDetailCard from "@/components/detailpage/ParkingDetailCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// const PARKING_OPTIONS = ["CPA Lot 888", "221 Centre St S", "116 2 Ave SW"];

export default function BookingPage() {
  const router = useRouter();

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
  } = localParams;

  console.log("BookingPage Params:", localParams);

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

  const extractRate = (html: string | undefined): number => {
    if (!html) return 7.0;
    const matches = html.match(/\$([\d.]+)/g);
    if (!matches) return 7.0;
    const rates = matches.map((r) => parseFloat(r.replace("$", "")));
    return rates.length ? rates[0] : 7.0;
  };

  const HOURLY_RATE = extractRate(html_zone_rate?.toString());
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

  const lot = {
    html_zone_rate: html_zone_rate?.toString() || "",
    max_time: max_time,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Parking Lot</Text>

        {!incomingAddress ? (
          <GooglePlacesAutocomplete
            placeholder="Search for a parking lot"
            fetchDetails
            onPress={(data, details = null) => {
              setAddressDesc(data.description ?? "Unknown Location");
            }}
            query={{
              key:
                process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "YOUR_BACKUP_API_KEY",
              language: "en",
              types: "establishment",
              keyword: "parking",
              location: "51.0447,-114.0719", // Calgary downtown (optional center point)
              radius: 3000,
            }}
            styles={{
              textInput: styles.input,
              listView: { backgroundColor: "#fff" },
            }}
            enablePoweredByContainer={false}
          />
        ) : (
          <Text style={[styles.input, { paddingVertical: 14 }]}>
            {addressDesc}
          </Text>
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
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            textColor="#000"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.label}>Start Hour</Text>
            <View style={styles.greyBox}>
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                textColor="#000"
                onChange={(e, selectedTime) => {
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            </View>
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.label}>End Hour</Text>
            <View style={styles.greyBox}>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                textColor="#000"
                onChange={(e, selectedTime) => {
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            </View>
          </View>
        </View>

        {html_zone_rate && (
          <View style={{ marginTop: 12 }}>
            <ParkingDetailCard
              lot={{
                html_zone_rate: html_zone_rate,
                max_time: max_time,
              }}
            />
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${total}</Text>
          <Text style={styles.totalUnit}>
            / {duration} hour{duration > 1 ? "s" : ""}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            router.push({
              pathname: "/booking/confirm-booking",
              params: {
                full_name: "Joy Wong",
                address: addressDesc?.toString() ?? "",
                time_start: startTime.toISOString(),
                time_end: endTime.toISOString(),
                duration: duration.toString(),
                total: total.toString(),
                license: licensePlate,
              },
            });
          }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  dropdownInput: {
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
  },
  dropdownText: {
    color: "#000",
  },
  greyBox: {
    backgroundColor: "#eee",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
