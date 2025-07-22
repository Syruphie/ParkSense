import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingPage() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 3600000)
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const HOURLY_RATE = 7.0;

  const calculateTotal = () => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.max(durationMs / (1000 * 60 * 60), 0); // prevent negative
    const roundedHours = Math.ceil(durationHours * 2) / 2; // round up to nearest 30 min
    return {
      total: (roundedHours * HOURLY_RATE).toFixed(2),
      duration: roundedHours,
    };
  };

  const { total, duration } = calculateTotal();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Parking Lot</Text>
        <TextInput value="CRA Lot 888" editable={true} style={styles.input} />

        <Text style={styles.label}>Spot</Text>
        <TextInput value="A31" editable={true} style={styles.input} />

        <Text style={styles.label}>License Plate</Text>
        <TextInput value="CST309" editable={true} style={styles.input} />

        <Text style={styles.label}>Date</Text>
        {/* <TouchableOpacity
          onPressIn={() => setShowDatePicker(true)}
          style={styles.inputWrapper}
        >
          <Text style={styles.inputText}>{format(date, "MMMM d, yyyy")}</Text>
          <Ionicons name="chevron-down" size={18} color="black" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />
        )} */}

        <View
          style={{ backgroundColor: "#eee", borderRadius: 10, padding: 10 }}
        >
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
          {/* <Ionicons name="chevron-down" size={18} color="black" /> */}
        </View>

        {/* <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.label}>Start Hour</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>
                {startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Ionicons name="time" size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(e, selectedTime) => {
                  setShowStartPicker(false);
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.label}>End Hour</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text>
                {endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Ionicons name="time" size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(e, selectedTime) => {
                  setShowEndPicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}
          </View>
        </View> */}

        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.label}>Start Hour</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(e, selectedTime) => {
                if (selectedTime) setStartTime(selectedTime);
              }}
            />
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.label}>End Hour</Text>
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(e, selectedTime) => {
                if (selectedTime) setEndTime(selectedTime);
              }}
            />
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${total}</Text>
          <Text style={styles.totalUnit}>
            / {duration} hour{duration > 1 ? "s" : ""}
          </Text>
        </View>

        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* <BottomNav /> */}
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
  },
  inputWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: {
    fontSize: 16,
    color: "#000",
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
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
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
