
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface LowStockAlertProps {
  products: Product[];
  threshold?: number;
  onOrderMore?: (productId: string) => void;
}

export function LowStockAlert({ products, threshold = 5, onOrderMore }: LowStockAlertProps) {
  // Filter products with low stock
  const lowStockProducts = products.filter(product => product.quantity <= threshold);
  
  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Package size={18} />
            Inventory Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center text-muted-foreground">
            All inventory levels are healthy
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle size={18} />
          Low Stock Alerts
          <Badge className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-100">
            {lowStockProducts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockProducts.map(product => (
          <Alert key={product.id} className="border border-orange-200 bg-orange-50">
            <div className="flex justify-between items-start">
              <div>
                <AlertTitle className="text-orange-800">{product.name}</AlertTitle>
                <AlertDescription className="text-orange-600 flex items-center mt-1">
                  <Package size={14} className="mr-1" />
                  Only {product.quantity} units left in stock
                </AlertDescription>
              </div>
              {onOrderMore && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => onOrderMore(product.id)}
                >
                  <ShoppingCart size={14} className="mr-1" />
                  Order More
                </Button>
              )}
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
