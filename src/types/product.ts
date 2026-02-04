
export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  quantity: number;
  costPrice?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  salesCount?: number;
  lastRestocked?: Date;
}
