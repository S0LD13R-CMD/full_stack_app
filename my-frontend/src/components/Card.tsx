import React from "react";

// Define the properties that the Card component will accept
interface CardProps {
  title: string;       // The title of the book
  author: string;      // The author of the book
  price: number;       // The price of the book
  colorClass: string;  // A Tailwind CSS class for styling the card's color
}

// Card component definition
class Card extends React.Component<CardProps> {
  render() {
    // Destructure the props for easier access
    const { title, author, price, colorClass } = this.props;
    return (
      // Apply the color class to the card for dynamic styling
      <div className={`card ${colorClass} shadow-xl`}>
        <div className="card-body">
          {/* Display the book title */}
          <h2 className="card-title">{title}</h2>
          {/* Display the author of the book */}
          <p>Author: {author}</p>
          {/* Display the price of the book */}
          <p>Price: £{price}</p>
          <div className="card-actions justify-end">
            {/* Button to view more details about the book */}
            <button className="btn btn-accent">View</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;