
import { Product } from "./product";

export interface BillItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  totalAmount: number;
  createdAt: Date;
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  status: 'completed' | 'pending' | 'cancelled';
}
