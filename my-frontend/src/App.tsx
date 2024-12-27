import React, { useState } from "react";
import "./index.css";

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

  // Calculate the total value of books based on the current view (owned or to-buy)
  const totalValue = (view === "owned" ? booksOwned : booksToBuy).reduce(
    (sum, book) => sum + book.price,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen p-4 gap-4">
        {/* Left Half - Book List */}
        <div className="w-1/2 p-4 bg-base-200 border border-primary rounded-lg shadow-md overflow-auto max-h-screen scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200">
          <div className="flex justify-between items-center mb-4">
            {/* Toggle Buttons on the Left */}
            <div className="flex gap-2">
              <button
                className={`btn ${view === "owned" ? "btn-primary" : "btn-ghost"} mr-2`}
                onClick={() => setView("owned")}
              >
                Books Owned
              </button>
              <button
                className={`btn ${view === "to-buy" ? "btn-secondary" : "btn-ghost"}`}
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
                className="p-4 bg-primary text-primary-content rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{book.name}</h3>
                <p className="text-sm">Price: £{book.price.toFixed(2)}</p>
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
              style={{ minHeight: "306px" }} // Ensures a consistent minimum height
            />
          </div>

          {/* Bottom Right - Toggle Buttons and Input Fields */}
          <div className="p-4 bg-base-200 border border-primary rounded-lg shadow-md">
            {/* Header and Buttons */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add a Book</h2>
              <div className="flex gap-2">
                <button
                  className={`btn ${!isJournal ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setIsJournal(false)}
                >
                  Normal Book
                </button>
                <button
                  className={`btn ${isJournal ? "btn-secondary" : "btn-ghost"}`}
                  onClick={() => setIsJournal(true)}
                >
                  Journal Book
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text">Book Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={bookInput.name}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              {!isJournal && (
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text">Author</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={bookInput.author || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              )}

              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={bookInput.price || ""}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                  step="0.01"
                  min="0"
                />
              </div>

              {isJournal && (
                <div className="flex gap-4 mb-4">
                  <div className="form-control w-1/2">
                    <label className="label mb-2">
                      <span className="label-text">Start Volume</span>
                    </label>
                    <input
                      type="number"
                      name="start"
                      value={volumeRange.start}
                      onChange={handleVolumeRangeChange}
                      className="input input-bordered"
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-control w-1/2">
                    <label className="label mb-2">
                      <span className="label-text">End Volume</span>
                    </label>
                    <input
                      type="number"
                      name="end"
                      value={volumeRange.end}
                      onChange={handleVolumeRangeChange}
                      className="input input-bordered"
                      required
                      min="1"
                    />
                  </div>
                </div>
              )}

              <div className="form-control">
                <button type="submit" className="btn btn-primary w-full">
                  {isJournal ? "Add Journal" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;