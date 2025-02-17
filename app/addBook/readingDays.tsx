import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";

export default function ReadingDays() {
  const router = useRouter();
  const { days, toggleDay, setPageComplete } = useBook();

  // Update the page's completion status whenever the days change.
  useEffect(() => {
    const anySelected = Object.values(days).some((selected) => selected);
    setPageComplete("readingDays", anySelected);
  }, [days]);

  return (
    <View style={styles.container}>
      <View style={styles.workingDaysContainer}>
        <Text style={styles.titleText}>What days do you read on?</Text>
        <Text style={styles.subtitle}>
          Note: you'll have 4 cheat days per month!
        </Text>
        {(Object.keys(days) as (keyof typeof days)[]).map((day) => (
          <View key={day} style={styles.dayCheckbox}>
            <Checkbox
              style={[
                styles.checkbox,
                days[day] && styles.checkboxSelected,
              ]}
              value={days[day]}
              onValueChange={() => toggleDay(day)}
            />
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
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
  workingDaysContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 5,
    width: "100%",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 10,
  },
  dayCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#000",
  },
  dayText: {
    fontSize: 16,
  },
});
