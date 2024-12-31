export interface Book {
    id: string;
    title: string;
    price: number;
    isRead: boolean;
    author?: string;    
    category?: string;
    tags?: string[];
}

export interface BookToBuy {
    id: string;
    title: string;
    price: number;
}