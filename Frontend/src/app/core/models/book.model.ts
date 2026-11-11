export interface Book {
  id?: number;
  coverImageUrl: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  amazonUrl: string;
  createdAt?: string;
}
