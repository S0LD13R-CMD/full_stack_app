import { Link } from "react-router-dom";

// The Home component serves as the landing page for the application
const Home: React.FC = () => {
  return (
    <div className="text-center">
      {/* Main heading for the home page */}
      <h1 className="text-3xl font-bold">Collections Manager</h1>
      <div className="mt-4">
        {/* Link to navigate to the Manage Books page */}
        <Link to="/books" className="text-purple-600">Manage Books</Link>
      </div>
      <div className="mt-2">
        {/* Link to navigate to the Books to Buy page */}
        <Link to="/books-to-buy" className="text-purple-600">Books to Buy</Link>
      </div>
    </div>
  );
};

export default Home;