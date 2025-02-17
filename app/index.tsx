import { Text, View, StyleSheet, Pressable, FlatList, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useBook } from "./AddBookContext"; // Assuming this is where your context hook is

// Define the type for the book data stored in AsyncStorage
interface StoredBook {
  title: string;
  author: string;
  year: string;
  cover_id: string;
  numberOfPages: number;
  deadline: string; // Stored as ISO string
  ppd: number;
  readingDays: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
}

export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<StoredBook[]>([]);
  const { loadBook } = useBook(); // Use the loadBook function from context

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksList = await AsyncStorage.getItem("booksList");
        if (booksList) {
          const books = JSON.parse(booksList);
          setBooks(books);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async (index: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedBooks = [...books];
              updatedBooks.splice(index, 1);
              await AsyncStorage.setItem("booksList", JSON.stringify(updatedBooks));
              setBooks(updatedBooks);
            } catch (error) {
              console.error("Failed to delete book", error);
              Alert.alert("Error", "Failed to delete the book. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleEditBook = async (book: StoredBook) => {
    await loadBook(book.cover_id);
    router.push("/editBook");
  };

  const renderBookItem = ({ item, index }: { item: StoredBook; index: number }) => (
    <View style={styles.bookItem}>
      <Pressable onPress={() => handleEditBook(item)}>
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookInfo}>Author: {item.author}</Text>
          <Text style={styles.bookInfo}>Year: {item.year}</Text>
          <Text style={styles.bookInfo}>Pages: {item.numberOfPages}</Text>
          <Text style={styles.bookInfo}>
            Deadline: {new Date(item.deadline).toLocaleDateString()}
          </Text>
          <Text style={styles.bookInfo}>PPD: {item.ppd}</Text>
        </View>
      </Pressable>
      {/* Removed conditional delete button (edit mode) */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Books</Text>
        {/* Edit button removed */}
      </View>
      <Link href="/addBook/bookSearch" asChild>
        <Pressable style={styles.addBookButton}>
          <Text style={styles.addBookButtonText}>Add Book</Text>
        </Pressable>
      </Link>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.bookList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#333",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  addBookButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  addBookButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bookList: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  bookInfo: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 3,
  },
});
