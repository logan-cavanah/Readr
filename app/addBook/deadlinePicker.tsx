import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";

export default function DeadlinePicker() {
  const router = useRouter();
  const { deadline, setDeadline, setPageComplete } = useBook();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDeadline(selectedDate);
      // Mark the deadlinePicker page as complete when a date is selected.
      setPageComplete("deadlinePicker", true);
    } else {
      // Optionally mark as incomplete if no date is selected.
      setPageComplete("deadlinePicker", false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>When do you want to read it by?</Text>
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000000",
  },
  datePicker: {
    width: "100%",
    marginBottom: 10,
  },
  selectedDate: {
    fontSize: 16,
    color: "#000",
  },
});