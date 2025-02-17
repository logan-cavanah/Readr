import React from "react";
import { Stack, useSegments } from "expo-router";
import { BookProvider, useBook } from "../AddBookContext";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "react-native-progress-step-bar";

const screenOrder = [
  "bookSearch",
  "bookDetails",
  "pagesInput",
  "deadlinePicker",
  "readingDays",
  "ppdDisplay",
];

const CustomHeader = () => {
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = screenOrder.indexOf(currentScreen);
  const { width } = Dimensions.get("window");
  const progressWidth = width - 80; // some horizontal margin

  return (
    <View style={styles.headerContainer}>
      <ProgressBar
        steps={screenOrder.length - 1}
        currentStep={currentStep}
        withDots
        dotDiameter={12}
        width={progressWidth}
        height={3}
        filledBarStyle={{ backgroundColor: "#4CAF50" }}
        backgroundBarStyle={{ backgroundColor: "#555" }}
      />
    </View>
  );
};

export default function AddBookLayout() {
  const segments = useSegments();
  const router = useRouter();
  const currentScreen = segments[segments.length - 1];
  const currentStep = screenOrder.indexOf(currentScreen);
  const prevScreen = currentStep > 0 ? screenOrder[currentStep - 1] : null;
  const nextScreen = currentStep < screenOrder.length - 1 ? screenOrder[currentStep + 1] : null;

  const Footer = () => {
    const { completionStatus } = useBook();
    const currentPageComplete = completionStatus[currentScreen as keyof typeof completionStatus];

    return (
      <View style={styles.footerContainer}>
        {currentScreen === "bookSearch" ? (
          <>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push("/" as any)}
            >
              <Text style={styles.buttonText}>←</Text>
            </TouchableOpacity>
            {nextScreen && (
              <TouchableOpacity
                disabled={!completionStatus["bookSearch"]}
                style={[
                  styles.footerButton,
                  !completionStatus["bookSearch"] && styles.disabledButton,
                ]}
                onPress={() => router.push(`/addBook/${nextScreen}` as any)}
              >
                <Text style={styles.buttonText}>→</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {prevScreen && (
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => router.push(`/addBook/${prevScreen}` as any)}
              >
                <Text style={styles.buttonText}>←</Text>
              </TouchableOpacity>
            )}
            {nextScreen && (
              <TouchableOpacity
                disabled={!currentPageComplete}
                style={[
                  styles.footerButton,
                  !currentPageComplete && styles.disabledButton,
                ]}
                onPress={() => router.push(`/addBook/${nextScreen}` as any)}
              >
                <Text style={styles.buttonText}>→</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <BookProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Adjust this value as needed
      >
        <Stack
          screenOptions={{
            header: () => <CustomHeader />,
          }}
        >
          <Stack.Screen name="bookSearch" />
          <Stack.Screen name="bookDetails" options={{ title: "Book Details" }} />
          <Stack.Screen name="pagesInput" options={{ title: "Number of Pages" }} />
          <Stack.Screen name="deadlinePicker" options={{ title: "Deadline" }} />
          <Stack.Screen name="readingDays" options={{ title: "Reading Days" }} />
          <Stack.Screen name="ppdDisplay" options={{ title: "Pages Per Day" }} />
        </Stack>
        <Footer />
      </KeyboardAvoidingView>
    </BookProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e", // Ensure the background color is consistent
  },
  headerContainer: {
    backgroundColor: "#25292e",
    paddingVertical: 10,
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#25292e",
  },
  footerButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 24,
    color: "#25292e",
  },
  disabledButton: {
    opacity: 0.5,
  },
});