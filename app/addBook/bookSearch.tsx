import { 
  Text, 
  View, 
  StyleSheet, 
  Button, 
  TextInput, 
  ActivityIndicator, 
  Pressable, 
  Keyboard,
  Image 
} from "react-native";
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { useBook } from "../AddBookContext";

interface Book {
  title: string;
  author: string;
  year: string;
  cover_id: string;
}

export default function NewBook() {
  const { setSelectedBook } = useBook();
  const { setPageComplete } = useBook();
  const router = useRouter();

  const [bookTitle, setBookTitle] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Local state to track the currently selected book index.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!bookTitle.trim()) {
      setError('Please enter a book title');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Whenever a new search is made, mark bookSearch as incomplete.
      setPageComplete("bookSearch", false);
      let searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookTitle)}`;

      if (authorInput.trim()) {
        searchUrl += `&author=${encodeURIComponent(authorInput)}`;
      }

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        let uniqueBooks = new Set<string>();
        let uniqueBookData: Book[] = [];

        for (let book of data.docs.slice(0, 3)) {
          const bookKey = `${book.title}- ${book.author_name?.join(', ')}`;
          if (!uniqueBooks.has(bookKey)) {
            uniqueBooks.add(bookKey);
            uniqueBookData.push({
              title: book.title || 'Title Unavailable',
              author: book.author_name?.join(', ') || 'Unknown author',
              year: book.first_publish_year?.toString() || 'Year Unavailable',
              cover_id: book.cover_i?.toString() || '',
            });
          }
          if (uniqueBookData.length === 3) break;
        }
        setBooks(uniqueBookData);
        // Reset the selected index if new results are loaded.
        setSelectedIndex(null);
      } else {
        setError('Book not found');
      }
    } catch (err) {
      setError('Failed to fetch book data');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBookTitle('');
    setAuthorInput('');
    setBooks([]);
    setError('');
    setSelectedIndex(null);
    // When clearing, mark the page as incomplete.
    setPageComplete("bookSearch", false);
  };

  // Modified: now updates the selected book in context and marks the page as complete.
  const handleSelectBook = (book: Book, index: number) => {
    setSelectedBook(book);
    setSelectedIndex(index);
    // Mark the bookSearch page as complete when a selection is made.
    setPageComplete("bookSearch", true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book Search</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter book title"
          placeholderTextColor="rgba(128, 128, 128, 0.5)"
          value={bookTitle}
          onChangeText={setBookTitle}
        />
        <TextInput
          style={[styles.input, styles.authorInput]}
          placeholder="Enter author name (optional)"
          placeholderTextColor="rgba(128, 128, 128, 0.5)"
          value={authorInput}
          onChangeText={setAuthorInput}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Search Book" onPress={handleSearch} />
        <Button title="Clear" onPress={handleClear} color="red" />
      </View>

      {loading && <ActivityIndicator style={styles.loader} />}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        books.map((book, index) => (
          <Pressable 
            key={index} 
            onPress={() => handleSelectBook(book, index)}
            style={[
              styles.resultContainer, 
              selectedIndex === index && styles.selectedContainer
            ]}
          >
            {book.cover_id !== '' ? (
              <Image 
                style={styles.coverImage} 
                source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg` }} 
              />
            ) : (
              <View style={[styles.coverImage, styles.coverPlaceholder]} />
            )}
            <View style={styles.resultTextContainer}>
              <Text>Title: {book.title}</Text>
              <Text>Author: {book.author}</Text>
              <Text>Year: {book.year}</Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    flex: 1,
    marginRight: 5,
  },
  authorInput: {
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  loader: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // New style for selected book container.
  selectedContainer: {
    backgroundColor: '#d3d3d3',
  },
  coverImage: {
    width: 50,
    height: 75,
    marginRight: 10,
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    backgroundColor: '#ccc',
  },
  resultTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
