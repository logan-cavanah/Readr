import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";

export default function PagesInput() {
  const router = useRouter();
  const { numberOfPages, setNumberOfPages, setPageComplete } = useBook();

  const handleChangeText = (text: string) => {
    setNumberOfPages(text);
    setPageComplete("pagesInput", text.trim().length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>How many pages are there in total?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of pages"
          placeholderTextColor="rgba(128, 128, 128, 0.5)"
          keyboardType="numeric"
          value={numberOfPages}
          onChangeText={handleChangeText}
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
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: "#000000",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});