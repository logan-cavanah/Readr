import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";

export default function BookDetails() {
  const router = useRouter();
  const { selectedBook } = useBook();

  if (!selectedBook) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No book selected.</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        {selectedBook.cover_id && (
          <Image
            style={styles.coverImage}
            source={{
              uri: `https://covers.openlibrary.org/b/id/${selectedBook.cover_id}-L.jpg`,
            }}
          />
        )}
        <View style={styles.bookContainer}>
          <Text style={styles.detailText}>Title: {selectedBook.title}</Text>
          <Text style={styles.detailText}>Author: {selectedBook.author}</Text>
          <Text style={styles.detailText}>Year: {selectedBook.year}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    paddingTop: 40, // Adjust this value to move content closer to the top
    paddingHorizontal: 20,
  },
  text: {
    color: "#ffffff",
    fontSize: 22,
  },
  coverImage: {
    width: 225,
    height: 338,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  bookContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 5,
    alignItems: "flex-start",
    width: "100%",
  },
  detailText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
