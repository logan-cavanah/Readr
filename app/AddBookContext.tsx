import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eachDayOfInterval, format } from "date-fns";
import { useRouter } from "expo-router"; // Add this import for navigation

/** 
 * Defines the structure of a Book object. 
 * This interface is used to type-check book data throughout the component.
 */
export interface Book {
  title: string;
  author: string;
  year: string;
  cover_id: string;
  ppd?: number;
  numberOfPages?: number;
  deadline?: string;
}

/** 
 * Defines the structure for tracking which days of the week a user reads.
 */
type WeekDays = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
};

/** 
 * Interface to track completion status of various steps in book setup.
 */
interface CompletionStatus {
  bookSearch: boolean;
  bookDetails: boolean;
  pagesInput: boolean;
  deadlinePicker: boolean;
  readingDays: boolean;
  ppdDisplay: boolean;
}

/** 
 * Defines the shape of the context value which includes state, setters, and utility functions.
 */
interface BookContextType {
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  numberOfPages: string;
  setNumberOfPages: (pages: string) => void;
  deadline: Date | null;
  setDeadline: (date: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  days: WeekDays;
  toggleDay: (day: keyof WeekDays) => void;
  ppd: number | null;
  setPpd: (ppd: number | null) => void;
  calculatePpd: () => void;
  calculateDeadlineFromPpd: (newPpd: number) => Date | null;
  manualPpdSet: boolean;
  setManualPpdSet: (manual: boolean) => void;
  completionStatus: CompletionStatus;
  setPageComplete: (page: keyof CompletionStatus, complete: boolean) => void;
  saveBook: () => Promise<void>;
  loadBook: (bookId: string) => Promise<void>;
}

// Create the context with an undefined initial value
const BookContext = createContext<BookContextType | undefined>(undefined);

/**
 * Provider component for BookContext. Manages the state and provides it to its children.
 */
export const BookProvider = ({ children }: { children: ReactNode }) => {
  // State for selected book
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  /** 
   * Effect to load book from storage when the component mounts.
   */
  useEffect(() => {
    const loadBook = async () => {
      try {
        const savedBook = await AsyncStorage.getItem("selectedBook");
        if (savedBook) {
          setSelectedBook(JSON.parse(savedBook));
        }
      } catch (error) {
        console.error("Failed to load the book from storage", error);
      }
    };
    loadBook();
  }, []);

  /** 
   * Effect to save book to storage whenever selectedBook changes.
   */
  useEffect(() => {
    const saveBookData = async () => {
      try {
        if (selectedBook) {
          await AsyncStorage.setItem("selectedBook", JSON.stringify(selectedBook));
        } else {
          await AsyncStorage.removeItem("selectedBook");
        }
      } catch (error) {
        console.error("Failed to save the book to storage", error);
      }
    };
    saveBookData();
  }, [selectedBook]);

  // State for additional book details
  const [numberOfPages, setNumberOfPages] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [days, setDays] = useState<WeekDays>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [ppd, setPpd] = useState<number | null>(null);
  const [manualPpdSet, setManualPpdSet] = useState(false);

  /** 
   * State for tracking the completion status of various steps in adding a book.
   */
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({
    bookSearch: false,
    bookDetails: true,
    pagesInput: false,
    deadlinePicker: false,
    readingDays: false,
    ppdDisplay: false,
  });

  /** 
   * Function to update the completion status of a specific page/step.
   */
  const setPageComplete = (page: keyof CompletionStatus, complete: boolean) => {
    setCompletionStatus((prev) => ({ ...prev, [page]: complete }));
  };

  /** 
   * Toggle the reading status for a specific day of the week.
   */
  const toggleDay = (day: keyof WeekDays) => {
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  /** 
   * Calculates pages per day (PPD) based on the number of pages, deadline, and reading days.
   * This function does not override a manually set PPD.
   */
  const calculatePpd = () => {
    if (!numberOfPages || !deadline || !Object.values(days).includes(true)) {
      setPpd(null);
      return;
    }
    if (manualPpdSet) {
      return; // Do not override manually set PPD
    }
    const totalPages = parseInt(numberOfPages, 10);
    const today = new Date();
    const readingDays = (Object.keys(days) as (keyof WeekDays)[]).filter(day => days[day]);
    const allDays = eachDayOfInterval({
      start: today,
      end: deadline,
    });
    const validDays = allDays.filter(date => {
      const dayName = format(date, "EEEE");
      return readingDays.includes(dayName as keyof WeekDays);
    });
    const numValidDays = validDays.length;
    if (numValidDays === 0) {
      setPpd(null);
    } else {
      setPpd(Math.ceil(totalPages / numValidDays));
    }
  };

  /** 
   * Calculates a new deadline based on a given PPD, used when manually adjusting PPD.
   */
  const calculateDeadlineFromPpd = (newPpd: number): Date | null => {
    if (!numberOfPages || !Object.values(days).includes(true)) {
      return null;
    }
    const totalPages = parseInt(numberOfPages, 10);
    const readingDays = (Object.keys(days) as (keyof WeekDays)[]).filter(day => days[day]);
    const today = new Date();
    let daysToRead = Math.ceil(totalPages / newPpd);
    let newDeadline = new Date(today);
    while (daysToRead > 0) {
      newDeadline.setDate(newDeadline.getDate() + 1);
      if (readingDays.includes(format(newDeadline, "EEEE") as keyof WeekDays)) {
        daysToRead--;
      }
    }
    return newDeadline;
  };

  /** 
   * Effect to recalculate PPD when dependencies change.
   */
  useEffect(() => {
    calculatePpd();
  }, [numberOfPages, deadline, days, manualPpdSet]);

  /** 
   * Saves the book details to AsyncStorage and navigates back to the main page.
   * This is the 'global' save function with navigation included.
   */
  const saveBook = async () => {
    try {
      if (!selectedBook || !deadline || !numberOfPages || !ppd) {
        alert("Please fill out all details before saving.");
        return;
      }

      const bookData = {
        ...selectedBook,
        numberOfPages: parseInt(numberOfPages, 10),
        deadline: deadline.toISOString(),
        ppd,
        readingDays: days,
      };

      const existingBooks = await AsyncStorage.getItem("booksList");
      let booksArray = existingBooks ? JSON.parse(existingBooks) : [];

      booksArray.push(bookData);

      await AsyncStorage.setItem("booksList", JSON.stringify(booksArray));

      setSelectedBook(null);
      router.replace("/");
    } catch (error) {
      console.error("Failed to save the book", error);
      alert("Failed to save the book. Please try again.");
    }
  };

  // New function to load a specific book
  const loadBook = async (bookId: string) => {
    try {
      const booksList = await AsyncStorage.getItem("booksList");
      if (booksList) {
        const books = JSON.parse(booksList);
        const book = books.find((b: Book) => b.cover_id === bookId);
        if (book) {
          setSelectedBook(book);
        } else {
          console.warn("Book not found with ID:", bookId);
        }
      }
    } catch (error) {
      console.error("Failed to load book:", error);
    }
  };

  const router = useRouter(); // Hook for navigation

  // Provide the context to all children components
  return (
    <BookContext.Provider
      value={{
        selectedBook,
        setSelectedBook,
        numberOfPages,
        setNumberOfPages,
        deadline,
        setDeadline,
        showDatePicker,
        setShowDatePicker,
        days,
        toggleDay,
        ppd,
        setPpd,
        calculatePpd,
        calculateDeadlineFromPpd,
        manualPpdSet,
        setManualPpdSet,
        completionStatus,
        setPageComplete,
        saveBook,
        loadBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

/**
 * Custom hook to use the Book context. 
 * Throws an error if used outside of BookProvider.
 */
export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};