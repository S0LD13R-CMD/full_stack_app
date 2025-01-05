export interface Book {
    id: string;          // Unique identifier for the book
    title: string;       // Title of the book
    price: number;       // Price of the book
    isRead: boolean;     // Flag to indicate if the book has been read
    author?: string;     // Optional author of the book
    category?: string;   // Optional category of the book
    tags?: string[];     // Optional tags associated with the book
}

export interface BookToBuy {
    id: string;          // Unique identifier for the book
    title: string;       // Title of the book
    price: number;       // Price of the book
}