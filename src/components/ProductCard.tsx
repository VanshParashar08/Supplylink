import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PlusSquare, 
  MinusSquare, 
  Tag, 
  BarcodeIcon, 
  Package
} from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showInventory?: boolean;
  onAddToBill?: (product: Product, quantity: number) => void;
  onUpdateQuantity?: (productId: string, newQuantity: number) => void;
}

export function ProductCard({ 
  product, 
  showInventory = false, 
  onAddToBill, 
  onUpdateQuantity 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToBill = () => {
    if (onAddToBill) {
      onAddToBill(product, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleUpdateInventory = (change: number) => {
    if (onUpdateQuantity) {
      const newQuantity = Math.max(0, product.quantity + change);
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const stockStatus = () => {
    if (product.quantity <= 0) return "out-of-stock";
    if (product.quantity < 5) return "low-stock";
    return "in-stock";
  };

  const stockBadge = () => {
    const status = stockStatus();
    
    if (status === "out-of-stock") {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    
    if (status === "low-stock") {
      return <Badge variant="outline" className="border-orange-400 text-orange-600">Low Stock ({product.quantity})</Badge>;
    }
    
    return <Badge variant="outline" className="border-green-400 text-green-600">In Stock ({product.quantity})</Badge>;
  };

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="flex items-center gap-1 text-xs">
                <BarcodeIcon size={12} />
                {product.barcode}
              </span>
              <span className="text-xs">|</span>
              <span className="flex items-center gap-1 text-xs">
                <Tag size={12} />
                {product.category}
              </span>
            </div>
          </div>
          <div className="ml-2">
            {stockBadge()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-retail-600">
            {formatCurrency(product.price)}
          </div>
          
          {showInventory ? (
            <div className="flex items-center space-x-2">
              <span className="flex items-center mr-1 text-muted-foreground text-sm">
                <Package size={16} className="mr-1" />
                {product.quantity}
              </span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => handleUpdateInventory(-1)}
                disabled={product.quantity <= 0}
                className="h-8 w-8"
              >
                <MinusSquare size={18} />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => handleUpdateInventory(1)}
                className="h-8 w-8"
              >
                <PlusSquare size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="h-8 w-8"
              >
                <MinusSquare size={18} />
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleIncrement}
                className="h-8 w-8"
              >
                <PlusSquare size={18} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      {!showInventory && onAddToBill && (
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            onClick={handleAddToBill}
            disabled={product.quantity <= 0 || stockStatus() === "out-of-stock"}
          >
            Add to Bill
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
