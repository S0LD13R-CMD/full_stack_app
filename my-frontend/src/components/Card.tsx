interface CardProps {
    title: string;
    author: string;
    price: number;
    colorClass: string; // Tailwind color class
  }
  
  const Card: React.FC<CardProps> = ({ title, author, price, colorClass }) => {
    return (
      <div className={`card ${colorClass} shadow-xl`}>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Author: {author}</p>
          <p>Price: ${price}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-accent">View</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;