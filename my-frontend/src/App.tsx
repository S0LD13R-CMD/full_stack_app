import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { app, db } from "./firebase-config";
import { doc, setDoc, getDoc, collection, deleteDoc } from "firebase/firestore";

interface Book {
  id: number;
  name: string;
  price: number;
  author?: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<"owned" | "to-buy">("owned");
  const [booksOwned, setBooksOwned] = useState<Book[]>([]);
  const [booksToBuy, setBooksToBuy] = useState<Book[]>([]);
  const [toReadNotes, setToReadNotes] = useState<string>("");
  const [bookInput, setBookInput] = useState<Book>({
    id: Date.now(),
    name: "",
    price: 0,
    author: "",
  });
  const [isJournal, setIsJournal] = useState(false); // Track if the journal toggle is active
  const [volumeRange, setVolumeRange] = useState<{ start: number; end: number }>({
    start: 1,
    end: 1,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const auth = getAuth(app); // Initialize Firebase Authentication

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
  
        // Load user data
        const userData = await loadUserData(user.uid);
        if (userData) {
          setBooksOwned(userData.booksOwned || []);
          setBooksToBuy(userData.booksToBuy || []);
          setToReadNotes(userData.notes || "");
        }
      } else {
        setIsAuthenticated(false);
      }
    });
  }, [auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuthenticated(true); // Successful login
      })
      .catch((error) => {
        alert(error.message); // Display error message
      });
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsAuthenticated(false); // Log out the user
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInput((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value, // Convert price to a number
    }));
  };

  const handleVolumeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVolumeRange((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || 1, // Ensure numeric value
    }));
  };

  const handleAddBook = async () => {
    if (auth.currentUser) {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let existingBooksOwned = [];
      let existingBooksToBuy = [];

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        existingBooksOwned = userData.booksOwned || [];
        existingBooksToBuy = userData.booksToBuy || [];
      }

      const newBook = { ...bookInput, id: Date.now() };
      const updatedBooks = view === "owned"
        ? [...existingBooksOwned, newBook]
        : [...existingBooksToBuy, newBook];

      if (view === "owned") {
        setBooksOwned(updatedBooks);
      } else {
        setBooksToBuy(updatedBooks);
      }

      // Save updated data to Firestore
      await setDoc(userDocRef, {
        booksOwned: view === "owned" ? updatedBooks : existingBooksOwned,
        booksToBuy: view === "to-buy" ? updatedBooks : existingBooksToBuy,
        notes: toReadNotes
      });

      setBookInput({ id: Date.now(), name: "", price: 0, author: "" });
    }
  };

  const handleAddJournal = async () => {
    const volumes = volumeRange.end - volumeRange.start + 1;
    const books: Book[] = [];

    for (let i = 0; i < volumes; i++) {
      const book = {
        ...bookInput,
        id: Date.now() + i,
        name: `${bookInput.name} - Volume ${volumeRange.start + i}`,
        author: bookInput.author,
        isJournal: true,
      };
      books.push(book);
    }

    // Update local state
    if (view === "owned") {
      setBooksOwned((prev) => [...prev, ...books]);
    } else {
      setBooksToBuy((prev) => [...prev, ...books]);
    }

    // Save updated data to Firestore
    if (auth.currentUser) {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let existingBooksOwned = [];
      let existingBooksToBuy = [];

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        existingBooksOwned = userData.booksOwned || [];
        existingBooksToBuy = userData.booksToBuy || [];
      }

      const updatedBooksOwned = view === "owned" ? [...existingBooksOwned, ...books] : existingBooksOwned;
      const updatedBooksToBuy = view === "to-buy" ? [...existingBooksToBuy, ...books] : existingBooksToBuy;

      await setDoc(userDocRef, {
        booksOwned: updatedBooksOwned,
        booksToBuy: updatedBooksToBuy,
        notes: toReadNotes
      });
    }

    // Reset form input fields
    setBookInput({ id: Date.now(), name: "", price: 0, author: "" });
    setVolumeRange({ start: 1, end: 1 });
  };

  const handleNoteChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNotes = e.target.value;
    setToReadNotes(updatedNotes);
  
    // Save notes to Firestore
    if (auth.currentUser) {
      await saveUserData(auth.currentUser.uid, booksOwned, booksToBuy, updatedNotes);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (isJournal) {
      handleAddJournal();
    } else {
      handleAddBook();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then(() => {
        alert("Registration successful!");
      })
      .catch((error) => {
        alert(error.message); // Display error message
      });
  };

  const handleDeleteBook = async (id: number) => {
    if (auth.currentUser) {
      const user = auth.currentUser;
      try {
        // Delete from individual books collection
        const bookRef = doc(collection(db, 'users', user.uid, 'books'), `book-${id}`);
        await deleteDoc(bookRef);

        // Update local state
        if (view === "owned") {
          setBooksOwned((prev) => prev.filter(book => book.id !== id));
        } else {
          setBooksToBuy((prev) => prev.filter(book => book.id !== id));
        }

        // Update the main user document
        await setDoc(doc(db, "users", user.uid), {
          booksOwned: view === "owned" ? booksOwned.filter(book => book.id !== id) : booksOwned,
          booksToBuy: view === "to-buy" ? booksToBuy.filter(book => book.id !== id) : booksToBuy,
          notes: toReadNotes
        });

        console.log(`Book with ID ${id} deleted successfully`);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };
  
  const totalValue = (view === "owned" ? booksOwned : booksToBuy).reduce(
    (sum, book) => sum + book.price,
    0
  );

  // Save user data (books and notes)
const saveUserData = async (uid: string, booksOwned: Book[], booksToBuy: Book[], notes: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      booksOwned,
      booksToBuy,
      notes,
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Load user data
const loadUserData = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No user data found!");
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

  return (
    <div className="min-h-screen flex flex-col px-8 py-4">
      {!isAuthenticated ? (
        <div className="flex justify-center items-center h-screen space-x-8">
          {/* Login Form */}
          <div className="p-8 bg-base-200 border-primary border-2 rounded-lg shadow-md w-1/2">
            <form
              onSubmit={isRegistering ? handleRegister : handleLogin}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold mb-4">Book Collection Manager</h1>
              <div className="form-control">
                <label className="label mb-2">Email</label>
                <input
                  type="email"
                  value={isRegistering ? registerEmail : email}
                  onChange={(e) =>
                    isRegistering
                      ? setRegisterEmail(e.target.value)
                      : setEmail(e.target.value)
                  }
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label mb-2">Password</label>
                <input
                  type="password"
                  value={isRegistering ? registerPassword : password}
                  onChange={(e) =>
                    isRegistering
                      ? setRegisterPassword(e.target.value)
                      : setPassword(e.target.value)
                  }
                  className="input input-bordered"
                  required
                />
              </div>
              <button type="submit" className="btn btn-accent w-full">
                {isRegistering ? "Register" : "Login"}
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="btn btn-secondary btn-outline w-full"
                >
                  {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </button>
              </div>
            </form>
          </div>

          {/* Website Details */}
          <div className="p-5 bg-base-200 border-primary border-2 rounded-lg shadow-md w-1/2">
            <h1 className="text-primary text-center text-2xl font-bold mb-6">Welcome to the Book Collection Manager! Here you can:</h1>
            <ol className="text-primary list-decimal list-inside ml-9">
              <li>Manage your personal library</li>
              <li>Keep track of your library's value</li>
              <li>Keep track of books you have bought</li>
              <li>Keep track of books you want to buy</li>
              <li>Keep notes on books you want to read</li>
            </ol>
            <h2 className="text-primary text-center text-xl font-bold mt-6">Enjoy organizing your reading journey with ease!</h2>
          </div>
        </div>
      ) : (
        <div className="flex h-screen p-4 gap-4">
          {/* Left Half - Book List */}
          <div className="w-1/2 p-4 bg-base-200 border border-primary rounded-lg shadow-md overflow-auto max-h-screen scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200">
            <div className="flex justify-between items-center mb-4">
              {/* Toggle Buttons on the Left */}
              <div className="flex gap-2">
                <button
                  className={`btn text-lg ${view === "owned" ? "btn-primary" : "btn-secondary btn-outline"} mr-2`}
                  onClick={() => setView("owned")}
                >
                  Books Owned
                </button>
                <button
                  className={`btn text-lg ${view === "to-buy" ? "btn-primary" : "btn-secondary btn-outline"}`}
                  onClick={() => setView("to-buy")}
                >
                  Books to Buy
                </button>
              </div>
              {/* Total Value on the Right */}
              <div className="text-lg font-bold">
                Total: £{totalValue.toFixed(2)}
              </div>
            </div>
            <ul className="space-y-4">
              {(view === "owned" ? booksOwned : booksToBuy).map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center p-3 mb-2 rounded-md bg-primary text-primary-content"
                >
                  <div>
                    <p className="font-bold">{book.name}</p>
                    <p>Price: £{book.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-primary-content hover:text-red-600"
                  >
                    &#x2716; {/* Cross symbol */}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Half */}
          <div className="w-1/2 flex flex-col gap-4">
            {/* Top Right - To-read Section (Book List View) */}
            <div className="p-4 bg-base-200 border border-primary rounded-lg shadow-md flex-1 overflow-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200">
              <textarea
                onChange={handleNoteChange}
                className="textarea textarea-bordered w-full resize-none"
                placeholder="Type your notes here..."
                value={toReadNotes}
                style={{ minHeight: "265px" }} // Ensures a consistent minimum height
              />
            </div>

            {/* Bottom Right - Toggle Buttons and Input Fields */}
            <div className="p-4 bg-base-200 border border-primary rounded-lg shadow-md space-y-5">
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="form-control">
                  <label className="label">Book Title</label>
                  <input
                    type="text"
                    name="name"
                    value={bookInput.name}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Author (Optional)</label>
                  <input
                    type="text"
                    name="author"
                    value={bookInput.author || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">Price (£)</label>
                  <input
                    type="number"
                    name="price"
                    value={bookInput.price || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isJournal}
                      onChange={() => setIsJournal(!isJournal)}
                      className="mr-2"
                    />
                    Journal
                  </label>

                  {isJournal && (
                    <div className="flex gap-4">
                      <div>
                        <label className="label">Start Volume</label>
                        <input
                          type="number"
                          name="start"
                          value={volumeRange.start}
                          onChange={handleVolumeRangeChange}
                          className="input input-bordered"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="label">End Volume</label>
                        <input
                          type="number"
                          name="end"
                          value={volumeRange.end}
                          onChange={handleVolumeRangeChange}
                          className="input input-bordered"
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  {isJournal ? "Add Journal" : "Add Book"}
                </button>
              </form>

              <button onClick={handleLogout} className="btn btn-secondary btn-outline w-full p-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;