import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Book, BookToBuy } from "../models/Book";

// Add a book to Firestore
export const addBook = async (book: Book) => {
  const booksRef = collection(db, "books"); // Reference to the 'books' collection in Firestore
  await addDoc(booksRef, book); // Add a new document to the collection
};

// Get all books
export const getBooks = async (): Promise<Book[]> => {
  const booksRef = collection(db, "books"); // Reference to the 'books' collection
  const snapshot = await getDocs(booksRef); // Get all documents in the collection
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Book)); // Map documents to Book objects
};

// Delete a book
export const deleteBook = async (id: string) => {
  const bookRef = doc(db, "books", id); // Reference to the specific book document
  await deleteDoc(bookRef); // Delete the document
};

// Update a book
export const updateBook = async (id: string, updatedBook: Partial<Book>) => {
  const bookRef = doc(db, "books", id); // Reference to the specific book document
  await updateDoc(bookRef, updatedBook); // Update the document with new data
};

// Add a book to buy
export const addBookToBuy = async (book: BookToBuy) => {
  const booksToBuyRef = collection(db, "booksToBuy"); // Reference to the 'booksToBuy' collection
  await addDoc(booksToBuyRef, book); // Add a new document to the collection
};

// Get all books to buy
export const getBooksToBuy = async (): Promise<BookToBuy[]> => {
  const booksToBuyRef = collection(db, "booksToBuy"); // Reference to the 'booksToBuy' collection
  const snapshot = await getDocs(booksToBuyRef); // Get all documents in the collection
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BookToBuy)); // Map documents to BookToBuy objects
};