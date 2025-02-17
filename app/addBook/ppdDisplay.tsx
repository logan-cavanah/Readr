import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  Platform,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";
export default function PpdDisplay() {
  const router = useRouter();
  const {
    ppd,
    deadline,
    setDeadline,
    calculatePpd,
    calculateDeadlineFromPpd,
    setPpd,
    manualPpdSet,
    setManualPpdSet,
    selectedBook,
    numberOfPages,
    days,
    saveBook,  // Now using the global function
  } = useBook();
  // State for showing the DateTimePicker modal (for deadline)
  const [showDatePicker, setShowDatePicker] = useState(false);
  // State for showing the PPD picker modal
  const [showPpdPicker, setShowPpdPicker] = useState(false);
  // We store the selected PPD value as a string for the Picker.
  const [ppdPickerValue, setPpdPickerValue] = useState(ppd ? String(ppd) : "1");

  // Synchronize the picker’s selected value with the current context ppd.
  useEffect(() => {
    if (ppd != null) {
      setPpdPickerValue(String(ppd));
    }
  }, [ppd]);

  // Format the deadline for display in a “verbose” way.
  const formatVerboseDeadline = (date: Date | null) => {
    if (!date) return "Select Date";
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };
    if (date.getFullYear() === nextYear) {
      options.year = "numeric";
    }
    return date
      .toLocaleDateString("en-US", options)
      .replace(/(\d+)(st|nd|rd|th)/, "$1");
  };

  // When the DateTimePicker returns a new date, update the deadline.
  // Also, if the user manually changes the deadline, clear the manual PPD override.
  const handleDeadlineChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    // On Android, the picker dismisses automatically.
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDeadline(selectedDate);
      // Since the user changed the deadline manually, clear the manual override.
      setManualPpdSet(false);
      calculatePpd(); // Recalculate ppd based on new deadline
    }
  };

  // When the user selects a new PPD value manually.
  const handlePpdChange = (value: number) => {
    setPpdPickerValue(String(value));
    setShowPpdPicker(false);
    // Calculate the new deadline based on the manually chosen PPD.
    // (In manual mode, the helper does not subtract one even if today is a reading day.)
    const newDeadline = calculateDeadlineFromPpd(value);
    if (newDeadline) {
      setDeadline(newDeadline);
      // Also update the ppd state so that the displayed value matches exactly the manual choice.
      setPpd(value);
      // Set the manual override flag so that automatic recalculations do not override the user’s choice.
      setManualPpdSet(true);
    }
  };

  return (
    <View style={styles.container}>
      {ppd && selectedBook ? (
        <>
          {/* Top Container: Book Name and Length */}
          <View style={styles.topContainer}>
            <Text style={styles.bookName}>
              {selectedBook.title} ({selectedBook.year})
            </Text>
          </View>

          {/* Middle Container: Deadline Date */}
          <View style={styles.middleContainer}>
            <Text style={styles.deadlineLabel}>Deadline:</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {formatVerboseDeadline(deadline)}
              </Text>
            </Pressable>
          </View>

          {/* Bottom Container: PPD */}
          <View style={styles.bottomContainer}>
            <Text style={styles.ppdLabel}>Pages Per Day:</Text>
            <Pressable onPress={() => setShowPpdPicker(true)}>
              <Text style={styles.ppdText}>{ppd} pages</Text>
            </Pressable>
          </View>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <Button title="Save Book" onPress={saveBook} />
          </View>

          {/* DateTimePicker Modal */}
          {showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={deadline || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={handleDeadlineChange}
                    themeVariant="light"
                    textColor={Platform.OS === "android" ? "black" : undefined}
                  />
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
          )}

          {/* PPD Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showPpdPicker}
            onRequestClose={() => setShowPpdPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Picker
                  selectedValue={ppdPickerValue}
                  onValueChange={(itemValue) =>
                    handlePpdChange(Number(itemValue))
                  }
                  style={styles.modalPicker}
                  itemStyle={{ color: "black", fontSize: 24 }}
                >
                  {[...Array(50).keys()].map((i) => (
                    <Picker.Item
                      key={i + 1}
                      label={`${i + 1} pages`}
                      value={`${i + 1}`}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPpdPicker(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.text}>
          Please fill out all details to calculate pages per day.
        </Text>
      )}
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
  topContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  middleContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "100%",
  },
  bookName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  deadlineLabel: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 24,
    color: "blue",
    textDecorationLine: "underline",
  },
  ppdLabel: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  ppdText: {
    fontSize: 24,
    color: "blue",
    textDecorationLine: "underline",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: "95%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalPicker: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#25292e",
    borderRadius: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
  saveButtonContainer: {
    marginTop: 20,
    width: "80%",
  },
});