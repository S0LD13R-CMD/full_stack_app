import React, { useState } from "react";
import "./index.css";

interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
}

const App: React.FC = () => {
  const [view, setView] = useState<"owned" | "to-buy">("owned");
  const [booksOwned, setBooksOwned] = useState<Book[]>([]);
  const [booksToBuy, setBooksToBuy] = useState<Book[]>([]);
  const [bookInput, setBookInput] = useState<Book>({
    id: Date.now(),
    name: "",
    author: "",
    price: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBook = () => {
    if (view === "owned") {
      setBooksOwned((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    } else {
      setBooksToBuy((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    }
    setBookInput({ id: Date.now(), name: "", author: "", price: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex h-screen p-4 gap-4">
      {/* Left Half - Book List */}
      <div className="w-1/2 p-4 bg-base-200 border border-primary rounded-lg shadow-md overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Books List</h2>
          <div className="flex gap-2">
          <button
            className={`btn ${view === 'owned' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('owned')}
          >
            Books Owned
          </button>
          <button
            className={`btn ${view === 'to-buy' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('to-buy')}
          >
            Books to Buy
          </button>
          </div>
        </div>
        <ul className="space-y-4">
          {(view === 'owned' ? booksOwned : booksToBuy).map((book) => (
            <li
              key={book.id}
              className="p-4 bg-primary text-primary-content rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold">{book.name}</h3>
              <p className="text-sm">Author: {book.author}</p>
              <p className="text-sm">Price: £{book.price}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Half */}
      <div className="w-1/2 flex flex-col gap-4">
        {/* Top Right - "To Read Next" */}
        <div className="flex-1 p-4 bg-base-200 border border-primary rounded-lg shadow-md overflow-auto">
          <h2 className="text-xl font-bold mb-4">To Read Next</h2>
          <p className="text-gray-600">Your "To Read Next" list will appear here.</p>
        </div>

        {/* Bottom Right - Input Field */}
        <div className="flex-1 p-4 bg-base-200 border border-primary rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add a Book</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddBook();
            }}
            className="space-y-4"
          >
            {/* Book Name */}
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
            {/* Author */}
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text">Author</span>
              </label>
              <input
                type="text"
                name="author"
                value={bookInput.author}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            {/* Price */}
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                name="price"
                value={bookInput.price}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default App;