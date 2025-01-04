import React from "react";

interface CardProps {
  title: string;
  author: string;
  price: number;
  colorClass: string; // Tailwind color class
}

class Card extends React.Component<CardProps> {
  render() {
    const { title, author, price, colorClass } = this.props;
    return (
      <div className={`card ${colorClass} shadow-xl`}>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Author: {author}</p>
          <p>Price: £{price}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-accent">View</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;