import { Stack } from "expo-router";
import { BookProvider } from "./AddBookContext";
import { useSegments } from "expo-router";

export default function RootLayout() {
  const segments = useSegments(); // Get current route segments
  const isAddBookFlow = segments[0] === "addBook"; // Check if user is in the addBook flow
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