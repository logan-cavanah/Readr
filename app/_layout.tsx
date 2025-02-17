import { Stack } from "expo-router";
import { BookProvider } from "./AddBookContext";
import { useSegments } from "expo-router";

/**
 * Root layout component that wraps the entire application.
 * Provides:
 * 1. Global state management through BookProvider
 * 2. Navigation stack with custom styling
 * 3. Conditional header visibility based on route
 */
export default function RootLayout() {
  // Get current route segments to determine if we're in the book addition flow
  const segments = useSegments();
  // Hide header during book addition to provide a cleaner multi-step form experience
  const isAddBookFlow = segments[0] === "addBook";
  return (
    <BookProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#25292e",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: !isAddBookFlow, 
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="editBook" options={{ title: "Edit Book" }} />
      </Stack>
    </BookProvider>
  );
}
