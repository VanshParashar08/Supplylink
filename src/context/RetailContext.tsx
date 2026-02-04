import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { BillItem, Bill } from "@/types/bill";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface RetailContextType {
  // Products and Inventory
  products: Product[];
  findProduct: (barcode: string) => Product | undefined;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<Product>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  
  // Billing
  currentBillItems: BillItem[];
  addToBill: (product: Product, quantity: number) => void;
  removeFromBill: (index: number) => void;
  updateBillItemQuantity: (index: number, quantity: number) => void;
  clearBill: () => void;
  createBill: (paymentMethod?: string, customerName?: string, customerPhone?: string) => Promise<Bill>;
  
  // Bills and History
  bills: Bill[];
  
  // Analytics
  salesData: { name: string; sales: number }[];
  categorySales: { name: string; value: number }[];
  productForecasts: {
    id: string;
    name: string;
    currentStock: number;
    predictedDemand: number;
    recommendedStock: number;
    trend: string;
  }[];
  
  // Helpers
  lowStockThreshold: number;
  getLowStockProducts: () => Product[];
  getTopSellingProducts: () => Product[];
  getTotalRevenue: () => number;
  getTotalInventoryValue: () => number;
  isLoading: boolean;
}

const RetailContext = createContext<RetailContextType | undefined>(undefined);

export function RetailProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentBillItems, setCurrentBillItems] = useState<BillItem[]>([]);
  const [salesData, setSalesData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [productForecasts, setProductForecasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const lowStockThreshold = 5;

  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          barcode: product.barcode,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          costPrice: product.cost_price,
          imageUrl: product.image_url,
          description: product.description,
          createdAt: new Date(product.created_at),
          updatedAt: new Date(product.updated_at),
          salesCount: product.sales_count
        }));

        setProducts(transformedProducts);

        const { data: billsData, error: billsError } = await supabase
          .from('bills')
          .select(`
            *,
            bill_items (
              *,
              product: products (*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (billsError) throw billsError;
        
        const transformedBills = billsData.map(bill => ({
          id: bill.id,
          items: bill.bill_items.map(item => ({
            product: {
              ...item.product,
              createdAt: new Date(item.product.created_at),
              updatedAt: new Date(item.product.updated_at)
            },
            quantity: item.quantity,
            totalPrice: item.total_price
          })),
          totalAmount: bill.total_amount,
          createdAt: new Date(bill.created_at),
          paymentMethod: bill.payment_method,
          customerName: bill.customer_name,
          customerPhone: bill.customer_phone,
          status: bill.status as 'completed' | 'pending' | 'cancelled'
        }));
        
        setBills(transformedBills);

        const monthlySales = calculateMonthlySales(transformedBills);
        setSalesData(monthlySales);

        const categorySalesData = calculateCategorySales(transformedBills);
        setCategorySales(categorySalesData);

        const forecastsData = calculateProductForecasts(transformedProducts, transformedBills);
        setProductForecasts(forecastsData);

      } catch (error) {
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const calculateMonthlySales = (bills: Bill[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesByMonth = new Array(12).fill(0);
    
    bills?.forEach(bill => {
      if (bill?.createdAt) {
        const date = new Date(bill.createdAt);
        salesByMonth[date.getMonth()] += Number(bill.totalAmount || 0);
      }
    });

    return months.map((name, index) => ({
      name,
      sales: salesByMonth[index]
    }));
  };

  const calculateCategorySales = (bills: Bill[]) => {
    const categoryTotals: { [key: string]: number } = {};
    
    bills?.forEach(bill => {
      bill.items?.forEach(item => {
        if (item?.product?.category) {
          const category = item.product.category;
          categoryTotals[category] = (categoryTotals[category] || 0) + Number(item.totalPrice || 0);
        }
      });
    });

    const totalSales = bills?.reduce((sum, bill) => sum + Number(bill?.totalAmount || 0), 0) || 1;
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round((value / totalSales) * 100)
    }));
  };

  const calculateProductForecasts = (products: Product[], bills: Bill[]) => {
    return products.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      currentStock: product.quantity,
      predictedDemand: Math.round(((product.salesCount || 0) / 30) * 7),
      recommendedStock: Math.max(product.quantity, Math.round(((product.salesCount || 0) / 30) * 14)),
      trend: product.salesCount && product.salesCount > 50 ? "increasing" : "stable"
    }));
  };

  const findProduct = (barcode: string) => {
    return products.find(p => p.barcode === barcode);
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      const transformedProduct: Product = {
        id: data.id,
        name: data.name,
        barcode: data.barcode,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        costPrice: data.cost_price,
        imageUrl: data.image_url,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        salesCount: data.sales_count
      };

      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? transformedProduct : product
        )
      );

      return transformedProduct;
    } catch (error) {
      toast({
        title: "Error updating product",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, quantity: newQuantity } : product
        )
      );

      toast({
        title: "Inventory Updated",
        description: `Quantity updated to ${newQuantity}`,
      });
    } catch (error) {
      toast({
        title: "Error updating quantity",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          barcode: productData.barcode,
          category: productData.category,
          price: productData.price,
          quantity: productData.quantity,
          cost_price: productData.costPrice,
          image_url: productData.imageUrl,
          description: productData.description,
          sales_count: productData.salesCount || 0
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedProduct: Product = {
        id: data.id,
        name: data.name,
        barcode: data.barcode,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        costPrice: data.cost_price,
        imageUrl: data.image_url,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        salesCount: data.sales_count
      };

      setProducts(prev => [...prev, transformedProduct]);

      toast({
        title: "Product Added",
        description: `${productData.name} added successfully`,
      });

      return transformedProduct;
    } catch (error) {
      toast({
        title: "Error adding product",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createBill = async (paymentMethod?: string, customerName?: string, customerPhone?: string) => {
    if (currentBillItems.length === 0) {
      throw new Error("Cannot create empty bill");
    }

    try {
      const totalAmount = currentBillItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .insert([{
          total_amount: totalAmount,
          payment_method: paymentMethod,
          customer_name: customerName,
          customer_phone: customerPhone,
          user_id: user?.id
        }])
        .select()
        .single();

      if (billError) throw billError;

      const billItems = currentBillItems.map(item => ({
        bill_id: bill.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price,
        total_price: item.totalPrice
      }));

      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw itemsError;

      // Update product quantities and sales counts
      for (const item of currentBillItems) {
        const newQuantity = item.product.quantity - item.quantity;
        const newSalesCount = (item.product.salesCount || 0) + item.quantity;

        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            quantity: newQuantity,
            sales_count: newSalesCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product.id);

        if (updateError) throw updateError;

        // Update local state
        setProducts(prev => 
          prev.map(product => 
            product.id === item.product.id 
              ? { 
                  ...product, 
                  quantity: newQuantity,
                  salesCount: newSalesCount,
                  updatedAt: new Date()
                }
              : product
          )
        );
      }

      // Transform the database response into a Bill type
      const transformedBill: Bill = {
        id: bill.id,
        items: currentBillItems,
        totalAmount: bill.total_amount,
        createdAt: new Date(bill.created_at),
        paymentMethod: bill.payment_method,
        customerName: bill.customer_name,
        customerPhone: bill.customer_phone,
        status: 'completed' as const
      };

      // Update the bills state
      setBills(prev => [...prev, transformedBill]);

      // Clear the current bill
      clearBill();

      return transformedBill;
    } catch (error) {
      toast({
        title: "Error creating bill",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addToBill = (product: Product, quantity: number) => {
    const existingIndex = currentBillItems.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const updatedItems = [...currentBillItems];
      const newQuantity = updatedItems[existingIndex].quantity + quantity;
      
      if (newQuantity > product.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.quantity} units available`,
          variant: "destructive"
        });
        return;
      }
      
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQuantity,
        totalPrice: product.price * newQuantity
      };
      
      setCurrentBillItems(updatedItems);
    } else {
      if (quantity > product.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.quantity} units available`,
          variant: "destructive"
        });
        return;
      }
      
      setCurrentBillItems(prev => [
        ...prev,
        {
          product,
          quantity,
          totalPrice: product.price * quantity
        }
      ]);
    }
    
    toast({
      title: "Added to Bill",
      description: `${quantity} x ${product.name}`,
    });
  };

  const removeFromBill = (index: number) => {
    setCurrentBillItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateBillItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...currentBillItems];
    const product = updatedItems[index].product;
    
    if (quantity > product.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} units available`,
        variant: "destructive"
      });
      return;
    }
    
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      totalPrice: product.price * quantity
    };
    
    setCurrentBillItems(updatedItems);
  };

  const clearBill = () => {
    setCurrentBillItems([]);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= lowStockThreshold);
  };

  const getTopSellingProducts = () => {
    return [...products]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);
  };

  const getTotalRevenue = () => {
    return bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  };

  const getTotalInventoryValue = () => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const value = {
    products,
    findProduct,
    updateProduct,
    updateQuantity,
    addProduct,
    
    currentBillItems,
    addToBill,
    removeFromBill,
    updateBillItemQuantity,
    clearBill,
    createBill,
    
    bills,
    
    salesData,
    categorySales,
    productForecasts,
    
    lowStockThreshold,
    getLowStockProducts,
    getTopSellingProducts,
    getTotalRevenue,
    getTotalInventoryValue,
    isLoading
  };

  return (
    <RetailContext.Provider value={value}>
      {children}
    </RetailContext.Provider>
  );
}

export function useRetail() {
  const context = useContext(RetailContext);
  if (context === undefined) {
    throw new Error("useRetail must be used within a RetailProvider");
  }
  return context;
}
