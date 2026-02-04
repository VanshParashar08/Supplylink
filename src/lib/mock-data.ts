
import { Product } from "@/types/product";
import { Bill, BillItem } from "@/types/bill";

// Generate a random date in the last 30 days
const getRandomRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
};

// Generate a random product ID
const generateProductId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate a random barcode (EAN-13 format)
const generateBarcode = () => {
  let result = "";
  for (let i = 0; i < 13; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

// Sample product data
export const mockProducts: Product[] = [
  {
    id: generateProductId(),
    name: "Organic Whole Milk",
    barcode: "7891234567890",
    category: "Dairy",
    price: 3.99,
    quantity: 18,
    costPrice: 2.50,
    description: "Fresh organic whole milk, 1 gallon",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-05-01"),
    salesCount: 245,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "White Bread",
    barcode: "6789012345678",
    category: "Bakery",
    price: 2.49,
    quantity: 12,
    costPrice: 1.25,
    description: "Sliced white bread, 1 loaf",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-05-05"),
    salesCount: 189,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Organic Eggs",
    barcode: "5678901234567",
    category: "Dairy",
    price: 4.99,
    quantity: 6,
    costPrice: 3.50,
    description: "Organic free-range eggs, dozen",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-05-10"),
    salesCount: 120,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Cheddar Cheese",
    barcode: "4567890123456",
    category: "Dairy",
    price: 3.79,
    quantity: 8,
    costPrice: 2.25,
    description: "Medium cheddar cheese, 8oz block",
    createdAt: new Date("2023-02-05"),
    updatedAt: new Date("2023-05-07"),
    salesCount: 98,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Chicken Breast",
    barcode: "3456789012345",
    category: "Meat",
    price: 8.99,
    quantity: 4,
    costPrice: 6.50,
    description: "Boneless, skinless chicken breast, 1lb",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-05-15"),
    salesCount: 156,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Bananas",
    barcode: "2345678901234",
    category: "Produce",
    price: 0.59,
    quantity: 30,
    costPrice: 0.30,
    description: "Fresh bananas, price per pound",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-05-18"),
    salesCount: 330,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Ground Coffee",
    barcode: "1234567890123",
    category: "Beverages",
    price: 7.99,
    quantity: 3,
    costPrice: 4.75,
    description: "Medium roast ground coffee, 12oz",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-05-20"),
    salesCount: 75,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Paper Towels",
    barcode: "8901234567890",
    category: "Household",
    price: 5.49,
    quantity: 9,
    costPrice: 3.25,
    description: "2-ply paper towels, 6 rolls",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-05-25"),
    salesCount: 62,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Spaghetti",
    barcode: "9012345678901",
    category: "Pasta",
    price: 1.79,
    quantity: 15,
    costPrice: 0.95,
    description: "Dried spaghetti pasta, 16oz",
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-06-01"),
    salesCount: 110,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Tomato Sauce",
    barcode: "0123456789012",
    category: "Canned Goods",
    price: 2.29,
    quantity: 21,
    costPrice: 1.10,
    description: "Organic tomato sauce, 24oz jar",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-06-05"),
    salesCount: 85,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Apples",
    barcode: "1122334455667",
    category: "Produce",
    price: 1.29,
    quantity: 25,
    costPrice: 0.75,
    description: "Gala apples, price per pound",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-06-10"),
    salesCount: 200,
    lastRestocked: getRandomRecentDate()
  },
  {
    id: generateProductId(),
    name: "Beef Steak",
    barcode: "2233445566778",
    category: "Meat",
    price: 12.99,
    quantity: 2,
    costPrice: 9.50,
    description: "Ribeye steak, 12oz",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-06-15"),
    salesCount: 45,
    lastRestocked: getRandomRecentDate()
  }
];

// Generate completed transaction history
export const mockBills: Bill[] = [
  {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        totalPrice: mockProducts[0].price * 2
      },
      {
        product: mockProducts[3],
        quantity: 1,
        totalPrice: mockProducts[3].price * 1
      }
    ],
    totalAmount: (mockProducts[0].price * 2) + (mockProducts[3].price * 1),
    createdAt: new Date("2023-05-10T14:30:00"),
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items: [
      {
        product: mockProducts[1],
        quantity: 1,
        totalPrice: mockProducts[1].price * 1
      },
      {
        product: mockProducts[5],
        quantity: 3,
        totalPrice: mockProducts[5].price * 3
      },
      {
        product: mockProducts[8],
        quantity: 2,
        totalPrice: mockProducts[8].price * 2
      }
    ],
    totalAmount: (mockProducts[1].price * 1) + (mockProducts[5].price * 3) + (mockProducts[8].price * 2),
    createdAt: new Date("2023-05-11T10:15:00"),
    paymentMethod: "Cash",
    status: "completed"
  },
  {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items: [
      {
        product: mockProducts[2],
        quantity: 1,
        totalPrice: mockProducts[2].price * 1
      },
      {
        product: mockProducts[6],
        quantity: 1,
        totalPrice: mockProducts[6].price * 1
      }
    ],
    totalAmount: (mockProducts[2].price * 1) + (mockProducts[6].price * 1),
    createdAt: new Date("2023-05-12T16:45:00"),
    paymentMethod: "Debit Card",
    status: "completed"
  },
  {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items: [
      {
        product: mockProducts[4],
        quantity: 2,
        totalPrice: mockProducts[4].price * 2
      },
      {
        product: mockProducts[9],
        quantity: 1,
        totalPrice: mockProducts[9].price * 1
      }
    ],
    totalAmount: (mockProducts[4].price * 2) + (mockProducts[9].price * 1),
    createdAt: new Date("2023-05-13T11:20:00"),
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items: [
      {
        product: mockProducts[7],
        quantity: 3,
        totalPrice: mockProducts[7].price * 3
      },
      {
        product: mockProducts[10],
        quantity: 2,
        totalPrice: mockProducts[10].price * 2
      },
      {
        product: mockProducts[1],
        quantity: 1,
        totalPrice: mockProducts[1].price * 1
      }
    ],
    totalAmount: (mockProducts[7].price * 3) + (mockProducts[10].price * 2) + (mockProducts[1].price * 1),
    createdAt: new Date("2023-05-14T09:30:00"),
    paymentMethod: "Cash",
    status: "completed"
  }
];

// Mock sales data for trend analysis
export const mockSalesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 4500 },
  { name: "Mar", sales: 3800 },
  { name: "Apr", sales: 4200 },
  { name: "May", sales: 5000 },
  { name: "Jun", sales: 4800 },
  { name: "Jul", sales: 5500 },
  { name: "Aug", sales: 6000 },
  { name: "Sep", sales: 5800 },
  { name: "Oct", sales: 6200 },
  { name: "Nov", sales: 7000 },
  { name: "Dec", sales: 7500 }
];

// Mock categories sales data
export const mockCategorySales = [
  { name: "Dairy", value: 32 },
  { name: "Produce", value: 24 },
  { name: "Meat", value: 15 },
  { name: "Bakery", value: 10 },
  { name: "Beverages", value: 8 },
  { name: "Canned Goods", value: 6 },
  { name: "Household", value: 5 }
];

// Mock product forecasts based on sales trends
export const mockProductForecasts = [
  {
    id: mockProducts[0].id,
    name: mockProducts[0].name,
    currentStock: mockProducts[0].quantity,
    predictedDemand: 25,
    recommendedStock: 30,
    trend: "increasing"
  },
  {
    id: mockProducts[2].id,
    name: mockProducts[2].name,
    currentStock: mockProducts[2].quantity,
    predictedDemand: 15,
    recommendedStock: 20,
    trend: "stable"
  },
  {
    id: mockProducts[4].id,
    name: mockProducts[4].name,
    currentStock: mockProducts[4].quantity,
    predictedDemand: 10,
    recommendedStock: 15,
    trend: "increasing"
  },
  {
    id: mockProducts[6].id,
    name: mockProducts[6].name,
    currentStock: mockProducts[6].quantity,
    predictedDemand: 8,
    recommendedStock: 12,
    trend: "decreasing"
  },
  {
    id: mockProducts[11].id,
    name: mockProducts[11].name,
    currentStock: mockProducts[11].quantity,
    predictedDemand: 5,
    recommendedStock: 8,
    trend: "stable"
  }
];

// Function to search for a product by barcode
export const findProductByBarcode = (barcode: string): Product | undefined => {
  return mockProducts.find(product => product.barcode === barcode);
};

// Function to update product quantity
export const updateProductQuantity = (productId: string, newQuantity: number): Product | undefined => {
  const productIndex = mockProducts.findIndex(product => product.id === productId);
  
  if (productIndex !== -1) {
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      quantity: newQuantity,
      updatedAt: new Date()
    };
    return mockProducts[productIndex];
  }
  
  return undefined;
};

// Function to add a new product
export const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    id: generateProductId(),
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

// Function to create a new bill
export const createBill = (items: BillItem[], paymentMethod?: string, customerName?: string, customerPhone?: string): Bill => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const bill: Bill = {
    id: "b-" + Math.random().toString(36).substring(2, 10),
    items,
    totalAmount,
    createdAt: new Date(),
    paymentMethod,
    customerName,
    customerPhone,
    status: "completed"
  };
  
  mockBills.push(bill);
  
  // Update product quantities and sales counts
  items.forEach(item => {
    const productIndex = mockProducts.findIndex(p => p.id === item.product.id);
    if (productIndex !== -1) {
      const updatedQuantity = Math.max(0, mockProducts[productIndex].quantity - item.quantity);
      const updatedSalesCount = (mockProducts[productIndex].salesCount || 0) + item.quantity;
      
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        quantity: updatedQuantity,
        salesCount: updatedSalesCount,
        updatedAt: new Date()
      };
    }
  });
  
  return bill;
};
