import { useState } from "react";
import { useRetail } from "@/context/RetailContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PackagePlus, 
  Search, 
  Plus, 
  Tag, 
  DollarSign, 
  Barcode,
  Package, 
  ClipboardList,
  Filter
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LowStockAlert } from "@/components/LowStockAlert";
import { Product } from "@/types/product";

export default function Inventory() {
  const { products, addProduct, updateQuantity, isLoading } = useRetail();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "price">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isLowStockOnly, setIsLowStockOnly] = useState(false);
  
  // New product form state
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductBarcode, setNewProductBarcode] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Uncategorized");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];
  
  // Handle adding a new product
  const handleAddProduct = () => {
    const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newProductName,
      barcode: newProductBarcode,
      category: newProductCategory,
      price: Number(newProductPrice),
      quantity: Number(newProductQuantity),
      description: newProductDescription,
      salesCount: 0
    };
    
    addProduct(newProduct);
    setIsAddProductDialogOpen(false);
    
    // Reset form
    setNewProductName("");
    setNewProductBarcode("");
    setNewProductCategory("Uncategorized");
    setNewProductPrice("");
    setNewProductQuantity("");
    setNewProductDescription("");
  };
  
  // Handle barcode scan for new product
  const handleBarcodeScan = (barcode: string) => {
    setNewProductBarcode(barcode);
    setIsScanning(false);
  };
  
  // Filter and sort products
  let filteredProducts = [...products];
  
  // Apply search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Apply category filter
  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
  }
  
  // Apply low stock filter
  if (isLowStockOnly) {
    filteredProducts = filteredProducts.filter(product => product.quantity < 5);
  }
  
  // Apply sorting
  filteredProducts.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "quantity") {
      comparison = a.quantity - b.quantity;
    } else if (sortBy === "price") {
      comparison = a.price - b.price;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Handle sorting change
  const handleSortChange = (newSortBy: "name" | "quantity" | "price") => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Inventory...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your inventory data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Inventory Management</h1>
        
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter product details or scan a barcode to add a new product to inventory.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {isScanning ? (
                <div className="space-y-4">
                  <Label>Scan Product Barcode</Label>
                  <BarcodeScanner onScan={handleBarcodeScan} />
                  <Button variant="outline" onClick={() => setIsScanning(false)}>
                    Enter Manually
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="product-name"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-barcode" className="text-right">
                      Barcode
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="product-barcode"
                        value={newProductBarcode}
                        onChange={(e) => setNewProductBarcode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => setIsScanning(true)}>
                        <Barcode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-category" className="text-right">
                      Category
                    </Label>
                    <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                      <SelectTrigger id="product-category" className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== "all").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Produce">Produce</SelectItem>
                        <SelectItem value="Meat">Meat</SelectItem>
                        <SelectItem value="Bakery">Bakery</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>
                        <SelectItem value="Canned Goods">Canned Goods</SelectItem>
                        <SelectItem value="Household">Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-price" className="text-right">
                      Price (₹)
                    </Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="product-quantity"
                      type="number"
                      min="0"
                      value={newProductQuantity}
                      onChange={(e) => setNewProductQuantity(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="product-description"
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleAddProduct}
                disabled={
                  !newProductName || 
                  !newProductBarcode || 
                  !newProductPrice || 
                  !newProductQuantity
                }
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Inventory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                      <p className="text-2xl font-bold">
                        {products.filter(p => p.quantity < 5).length}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          products.reduce((total, product) => total + (product.price * product.quantity), 0)
                        )}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <LowStockAlert products={products} />
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Product Inventory</CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-[150px] md:w-[200px]"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Category</p>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Label htmlFor="low-stock-only" className="flex-1 text-sm">
                        Low Stock Only
                      </Label>
                      <input
                        id="low-stock-only"
                        type="checkbox"
                        checked={isLowStockOnly}
                        onChange={(e) => setIsLowStockOnly(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex rounded-md overflow-hidden border border-input">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-3 rounded-none ${view === "grid" ? "bg-muted" : ""}`}
                  onClick={() => setView("grid")}
                >
                  <Package className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-3 rounded-none ${view === "table" ? "bg-muted" : ""}`}
                  onClick={() => setView("table")}
                >
                  <ClipboardList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    showInventory={true}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSortChange("name")}>
                        <div className="flex items-center">
                          Product Name
                          {sortBy === "name" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSortChange("price")}>
                        <div className="flex items-center">
                          Price
                          {sortBy === "price" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSortChange("quantity")}>
                        <div className="flex items-center">
                          Quantity
                          {sortBy === "quantity" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.barcode}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            <span>{product.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell className={product.quantity < 5 ? "text-orange-600 font-medium" : ""}>
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, Math.max(0, product.quantity - 1))}
                            >
                              <div className="h-5 w-5 flex items-center justify-center">-</div>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, product.quantity + 1)}
                            >
                              <div className="h-5 w-5 flex items-center justify-center">+</div>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
