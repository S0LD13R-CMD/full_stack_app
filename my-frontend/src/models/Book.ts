export interface Book {
    id: string;
    title: string;
    price: number;
    isRead: boolean;
    category?: string;
}

export interface BookToBuy {
    id: string;
    title: string;
    price: number;
}