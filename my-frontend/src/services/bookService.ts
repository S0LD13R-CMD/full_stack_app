import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Book, BookToBuy } from "../models/Book";

// Add a book to Firestore
export const addBook = async (book: Book) => {
  const booksRef = collection(db, "books");
  await addDoc(booksRef, book);
};

// Get all books
export const getBooks = async (): Promise<Book[]> => {
  const booksRef = collection(db, "books");
  const snapshot = await getDocs(booksRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Book));
};

// Delete a book
export const deleteBook = async (id: string) => {
  const bookRef = doc(db, "books", id);
  await deleteDoc(bookRef);
};

// Update a book
export const updateBook = async (id: string, updatedBook: Partial<Book>) => {
  const bookRef = doc(db, "books", id);
  await updateDoc(bookRef, updatedBook);
};

// Add a book to buy
export const addBookToBuy = async (book: BookToBuy) => {
  const booksToBuyRef = collection(db, "booksToBuy");
  await addDoc(booksToBuyRef, book);
};

// Get all books to buy
export const getBooksToBuy = async (): Promise<BookToBuy[]> => {
  const booksToBuyRef = collection(db, "booksToBuy");
  const snapshot = await getDocs(booksToBuyRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BookToBuy));
};