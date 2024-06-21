export interface Listing {
    id?: number;
    title: string;
    description: string;
    price: number;
    userId: number;
    category: string;
    imageData?: string;
    numberOfLikes: number;
};