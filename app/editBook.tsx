import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBook } from './AddBookContext';

export default function EditBook() {
  const {
    selectedBook,
    setSelectedBook,
    numberOfPages,
    setNumberOfPages,
    setPageComplete,
    days,
    toggleDay,
  } = useBook();
  const router = useRouter();

  // Pre-populate numberOfPages if the selected book has a page count
  useEffect(() => {
    if (selectedBook && selectedBook.numberOfPages && numberOfPages === '') {
      const pages = String(selectedBook.numberOfPages);
      setNumberOfPages(pages);
      setPageComplete('pagesInput', pages.trim().length > 0);
    }
  }, [selectedBook]);

  // Update the reading days page completion status whenever days change
  useEffect(() => {
    const anySelected = Object.values(days).some((selected) => selected);
    setPageComplete('readingDays', anySelected);
  }, [days]);

  const handleDelete = async () => {
    if (!selectedBook) return;
    Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const booksList = await AsyncStorage.getItem('booksList');
            let books = [];
            if (booksList) {
              books = JSON.parse(booksList);
            }
            const updatedBooks = books.filter(
              (book: { cover_id: string }) =>
                book.cover_id !== selectedBook.cover_id
            );
            await AsyncStorage.setItem('booksList', JSON.stringify(updatedBooks));
            setSelectedBook(null);
            router.push('/');
          } catch (error) {
            console.error('Error deleting book:', error);
            Alert.alert('Error', 'There was an error deleting the book.');
          }
        },
      },
    ]);
  };

  const handleChangeText = (text: string) => {
    setNumberOfPages(text);
    setPageComplete('pagesInput', text.trim().length > 0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedBook ? (
        <>
          {/* Book Details Section */}
          <View style={styles.bookDetailsContainer}>
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

          {/* Pages Input Section */}
          <View style={styles.pagesContainer}>
            <Text style={styles.inputLabel}>Page Count:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of pages"
              placeholderTextColor="rgba(128, 128, 128, 0.5)"
              keyboardType="numeric"
              value={numberOfPages}
              onChangeText={handleChangeText}
            />
          </View>

          {/* Reading Days Section */}
          <View style={styles.readingDaysContainer}>
            <Text style={styles.titleText}>What days do you read on?</Text>
            <Text style={styles.subtitle}>
              Note: you'll have 4 cheat days per month!
            </Text>
            {(Object.keys(days) as (keyof typeof days)[]).map((day) => (
              <View key={day} style={styles.dayCheckbox}>
                <Checkbox
                  style={[styles.checkbox, days[day] && styles.checkboxSelected]}
                  value={days[day]}
                  onValueChange={() => toggleDay(day)}
                />
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Placeholder for additional edit content */}
          <View style={styles.blankArea}>
            <Text style={styles.blankText}>
              [Additional edit content will go here...]
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.noBookText}>No book selected.</Text>
      )}

      {/* Delete Button */}
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Book</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  bookDetailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 225,
    height: 338,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  bookContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 5,
    alignItems: 'flex-start',
    width: '100%',
  },
  detailText: {
    fontSize: 20,
    marginBottom: 10,
  },
  pagesContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#000000',
  },
  input: {
    height: 40,
    width: 80,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
  },
  readingDaysContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#000',
  },
  dayText: {
    fontSize: 16,
  },
  blankArea: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  blankText: {
    fontSize: 16,
    color: '#000000',
  },
  noBookText: {
    color: '#ffffff',
    fontSize: 22,
    marginVertical: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
