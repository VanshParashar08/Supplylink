import { useState } from "react";
import { useRetail } from "@/context/RetailContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  IndianRupee, 
  CreditCard, 
  Trash2, 
  ReceiptText,
  ArrowDown, 
  ArrowUp,
  MinusSquare, 
  PlusSquare, 
  Tag, 
  SearchIcon, 
  ChevronDown 
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export default function Billing() {
  const { 
    products, 
    findProduct, 
    currentBillItems, 
    addToBill, 
    removeFromBill, 
    updateBillItemQuantity, 
    clearBill, 
    createBill,
    isLoading 
  } = useRetail();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  
  // Format currency
  
  
  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    const product = findProduct(barcode);
    
    if (product) {
      setScannedProduct(product);
      setIsQuantityDialogOpen(true);
      setSelectedQuantity(1);
    } else {
      setScannedProduct(null);
    }
  };
  
  // Handle search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate total amount
  const totalAmount = currentBillItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Handle completing the payment
  const handleCompletePayment = () => {
    try {
      createBill(paymentMethod, customerName, customerPhone);
      setIsPaymentComplete(true);
      
      // Reset form
      setPaymentMethod("Cash");
      setCustomerName("");
      setCustomerPhone("");
      
      // Reset after a delay
      setTimeout(() => {
        setIsPaymentComplete(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };
  
  // Handle adding scanned product to bill
  const handleAddScannedProduct = () => {
    if (scannedProduct) {
      addToBill(scannedProduct, selectedQuantity);
      setScannedProduct(null);
      setIsQuantityDialogOpen(false);
    }
  };
  
  // Quantity increment/decrement
  const incrementQuantity = () => {
    if (scannedProduct && selectedQuantity < scannedProduct.quantity) {
      setSelectedQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Billing System...</h2>
            <p className="text-muted-foreground">Please wait while we set up the billing interface</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product Search & Scan */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Scan Barcode</CardTitle>
            </CardHeader>
            <CardContent>
              <BarcodeScanner onScan={handleBarcodeScan} buttonText="Scan Product Barcode" />
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, category or barcode..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.slice(0, 6).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToBill={addToBill}
              />
            ))}
          </div>
          
          {filteredProducts.length > 6 && (
            <Button variant="link" className="mt-4 w-full">
              View All Results ({filteredProducts.length})
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Right column - Current Bill */}
        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Current Bill
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {currentBillItems.length} items
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[40vh] overflow-y-auto">
              {currentBillItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No items added to the bill yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scan a product or search to add items
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBillItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <p>{formatCurrency(item.product.price)} × {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => updateBillItemQuantity(index, item.quantity + 1)}
                            disabled={item.quantity >= item.product.quantity}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => updateBillItemQuantity(index, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromBill(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            
            {currentBillItems.length > 0 && (
              <>
                <Separator />
                <CardFooter className="flex flex-col pt-6">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  
                  <div className="flex gap-3 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={clearBill}
                      disabled={currentBillItems.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          className="flex-1"
                          disabled={currentBillItems.length === 0 || isPaymentComplete}
                        >
                          {isPaymentComplete ? (
                            <>
                              <ReceiptText className="mr-2 h-4 w-4" />
                              Completed
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Checkout
                            </>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Checkout</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b">
                              <span className="font-medium">Total Amount</span>
                              <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                  <SelectTrigger id="payment-method">
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                                    <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="customer-name">Customer Name (Optional)</Label>
                                <Input 
                                  id="customer-name" 
                                  value={customerName} 
                                  onChange={(e) => setCustomerName(e.target.value)} 
                                  placeholder="Enter customer name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="customer-phone">Phone Number (Optional)</Label>
                                <Input 
                                  id="customer-phone" 
                                  value={customerPhone} 
                                  onChange={(e) => setCustomerPhone(e.target.value)} 
                                  placeholder="Enter phone number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <SheetFooter className="mt-6">
                          <Button onClick={handleCompletePayment} className="w-full">
                            <IndianRupee className="mr-2 h-4 w-4" />
                            Complete Payment
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
      
      {/* Quantity Dialog */}
      <Dialog open={isQuantityDialogOpen} onOpenChange={setIsQuantityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Quantity</DialogTitle>
          </DialogHeader>
          
          {scannedProduct && (
            <div className="py-4">
              <div className="mb-4">
                <p className="text-lg font-bold">{scannedProduct.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag size={14} className="mr-1" />
                  <span>{scannedProduct.category}</span>
                  <span>•</span>
                  <span>{formatCurrency(scannedProduct.price)}/each</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="text-muted-foreground mb-2">Available: {scannedProduct.quantity} units</div>
                <div className="flex items-center gap-4 mb-4">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={decrementQuantity}
                    disabled={selectedQuantity <= 1}
                  >
                    <MinusSquare className="h-5 w-5" />
                  </Button>
                  
                  <div className="w-16 text-center text-2xl font-bold">
                    {selectedQuantity}
                  </div>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={incrementQuantity}
                    disabled={scannedProduct && selectedQuantity >= scannedProduct.quantity}
                  >
                    <PlusSquare className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="text-center mb-2">
                  Total: <span className="font-bold">{formatCurrency(scannedProduct.price * selectedQuantity)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsQuantityDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddScannedProduct}>
              Add to Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
