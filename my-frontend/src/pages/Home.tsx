import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Collections Manager</h1>
      <div className="mt-4">
        <Link to="/books" className="text-purple-600">Manage Books</Link>
      </div>
      <div className="mt-2">
        <Link to="/books-to-buy" className="text-purple-600">Books to Buy</Link>
      </div>
    </div>
  );
};

export default Home;