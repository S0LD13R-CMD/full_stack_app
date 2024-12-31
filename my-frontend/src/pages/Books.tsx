import { useEffect, useState } from "react";
import { getBooks, addBook, deleteBook } from "../services/bookService";
import { Book } from "../models/Book";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState(0);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getBooks();
      setBooks(booksData);
    };
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    const newBook: Book = { id: "", title, author, price, isRead };
    await addBook(newBook);
    setBooks([...books, newBook]);
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div>
      <h1>Manage Books</h1>
      <div>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <label>
          <input
            type="checkbox"
            checked={isRead}
            onChange={(e) => setIsRead(e.target.checked)}
          />
          Read
        </label>
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - ${book.price} - {book.isRead ? "Read" : "Not Read"}
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;