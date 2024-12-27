import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase-config";

interface Book {
  id: number;
  name: string;
  price: number;
  author?: string; // Author is optional
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
    // Check if the user is logged in when the app loads
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
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

  const handleAddBook = () => {
    if (view === "owned") {
      setBooksOwned((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    } else {
      setBooksToBuy((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    }
    setBookInput({ id: Date.now(), name: "", price: 0, author: "" });
  };

  const handleAddJournal = () => {
    const volumes = volumeRange.end - volumeRange.start + 1; // Calculate the number of volumes
    const books: Book[] = [];

    for (let i = 0; i < volumes; i++) {
      books.push({
        ...bookInput,
        id: Date.now() + i,
        name: `${bookInput.name} - Volume ${volumeRange.start + i}`,
        author: bookInput.author, // Ensure author is included for journals
      });
    }

    if (view === "owned") {
      setBooksOwned((prev) => [...prev, ...books]);
    } else {
      setBooksToBuy((prev) => [...prev, ...books]);
    }

    setBookInput({ id: Date.now(), name: "", price: 0, author: "" });
    setVolumeRange({ start: 1, end: 1 }); // Reset volume range
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

  const handleDeleteBook = (id: number) => {
    if (view === "owned") {
      setBooksOwned((prev) => prev.filter((book) => book.id !== id));
    } else {
      setBooksToBuy((prev) => prev.filter((book) => book.id !== id));
    }
  };
  const totalValue = (view === "owned" ? booksOwned : booksToBuy).reduce(
    (sum, book) => sum + book.price,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthenticated ? (
        <div className="flex justify-center items-center h-screen">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 p-4 bg-base-200 border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Book Collection Manager</h1>
            <div className="form-control">
              <label className="label mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered" required />
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="btn btn-accent">Login</button>
              <button onClick={() => setIsRegistering(true)} className="btn btn-secondary">Register</button>
            </div>
          </form>
          {isRegistering && (
            <form onSubmit={handleRegister} className="space-y-4 p-4 bg-base-200 border rounded-lg shadow-md mt-4">
              {/* Registration Form */}
              <div className="form-control">
                <label className="label mb-2">Email</label>
                <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label mb-2">Password</label>
                <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="input input-bordered" required />
              </div>
              <div className="flex justify-between items-center">
                <button type="submit" className="btn btn-accent">Register</button>
                <button onClick={() => setIsRegistering(false)} className="btn btn-secondary">Already have an account? Login</button>
              </div>
            </form>
          )}
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
                  className="flex justify-between items-center bg-primary text-primary-content p-3 mb-2 rounded-md"                >
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
                className="textarea textarea-bordered w-full resize-none"
                placeholder="Type your notes here..."
                value={toReadNotes}
                onChange={(e) => setToReadNotes(e.target.value)}
                style={{ minHeight: "277px" }} // Ensures a consistent minimum height
              />
            </div>

            {/* Bottom Right - Toggle Buttons and Input Fields */}
            <div className="p-4 bg-base-200 border border-primary rounded-lg shadow-md">
              <form onSubmit={handleFormSubmit} className="space-y-4">
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

              <button onClick={handleLogout} className="btn btn-danger mt-4 w-full">
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