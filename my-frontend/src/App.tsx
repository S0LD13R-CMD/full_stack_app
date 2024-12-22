import React, { useState } from 'react';
import './index.css';
import './App.css';

interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
}

const App: React.FC = () => {
  const [view, setView] = useState<'owned' | 'to-buy'>('owned');
  const [booksOwned, setBooksOwned] = useState<Book[]>([]);
  const [booksToBuy, setBooksToBuy] = useState<Book[]>([]);
  const [bookInput, setBookInput] = useState<Book>({
    id: Date.now(),
    name: '',
    author: '',
    price: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setBookInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleAddBook = () => {
    if (view === 'owned') {
      setBooksOwned((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    } else {
      setBooksToBuy((prev) => [...prev, { ...bookInput, id: Date.now() }]);
    }
    setBookInput({ id: Date.now(), name: '', author: '', price: 0 });
  };

  return (
    <div className="bg-base-200 min-h-screen p-6">
  <header className="navbar bg-base-100 shadow-md mb-6">
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl">Book Manager</a>
    </div>
  </header>

  <div className="mb-6 text-center">
    <button
      className={`btn ${view === 'owned' ? 'btn-primary' : 'btn-ghost'} mr-2`}
      onClick={() => setView('owned')}
    >
      Books Owned
    </button>
    <button
      className={`btn ${view === 'to-buy' ? 'btn-primary' : 'btn-ghost'}`}
      onClick={() => setView('to-buy')}
    >
      Books to Buy
    </button>
  </div>

  <div className="flex flex-wrap gap-6">
    <div className="flex-1 bg-base-100 shadow-md rounded-lg p-4 border-2 border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">
        {view === 'owned' ? 'Books Owned' : 'Books to Buy'}
      </h2>
      {view === 'owned' && booksOwned.length === 0 && <p>No books owned yet.</p>}
      {view === 'to-buy' && booksToBuy.length === 0 && <p>No books to buy yet.</p>}
      <ul className="space-y-4">
        {(view === 'owned' ? booksOwned : booksToBuy).map((book) => (
          <li
            key={book.id}
            className="p-4 bg-primary text-primary-content rounded-lg shadow-lg border-2 border-gray-300"
          >
            <h3 className="text-lg font-semibold">{book.name}</h3>
            <p className="text-sm text-gray-600">Author: {book.author}</p>
            <p className="text-sm text-gray-600">Price: £{book.price}</p>
          </li>
        ))}
      </ul>
    </div>

    <div className="w-full sm:w-1/3 bg-base-100 shadow-md rounded-lg p-4">
  <h2 className="text-2xl font-semibold mb-4">Add a Book</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleAddBook();
    }}
    className="space-y-4" // Adds spacing between form elements
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
  );
};

export default App;