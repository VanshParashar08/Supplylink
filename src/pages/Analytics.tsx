import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LowStockAlert } from "@/components/LowStockAlert";
import { useRetail } from "@/context/RetailContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3, 
  LineChart as LineChartIcon,
  ShoppingCart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight, 
  BrainCircuit,
  Package,
  BellRing
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  const { 
    products, 
    getLowStockProducts, 
    getTopSellingProducts, 
    salesData, 
    categorySales, 
    productForecasts,
    isLoading 
  } = useRetail();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const lowStockProducts = getLowStockProducts();
  const topSellingProducts = getTopSellingProducts();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Forecast data for chart
  const forecastData = [
    { name: "Week 1", actual: 4000, predicted: 4000 },
    { name: "Week 2", actual: 4500, predicted: 4200 },
    { name: "Week 3", actual: 3800, predicted: 4100 },
    { name: "Week 4", actual: 4200, predicted: 4300 },
    { name: "Week 5", predicted: 4800 },
    { name: "Week 6", predicted: 5000 },
    { name: "Week 7", predicted: 5300 },
    { name: "Week 8", predicted: 5100 }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Analytics...</h2>
            <p className="text-muted-foreground">Please wait while we process your retail data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Analytics & Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing size={18} className="text-yellow-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockProducts.length}</div>
            <p className="text-sm text-muted-foreground">
              Products below threshold
            </p>
            {lowStockProducts.length > 0 && (
              <Badge variant="outline" className="mt-2 border-yellow-300 text-yellow-700 bg-yellow-50">
                Needs attention
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package size={18} className="text-blue-500" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-sm text-muted-foreground">
              In your inventory
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+2</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity size={18} className="text-green-500" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+12.5%</div>
            <p className="text-sm text-muted-foreground">
              Increase in monthly sales
            </p>
            <div className="mt-2 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.slice(-6)}>
                  <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Forecast */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Sales Forecast & Predictions
                  </CardTitle>
                  <CardDescription>
                    Actual vs predicted sales for upcoming weeks
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  AI Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Tabs defaultValue="area">
                  <TabsList className="mb-4">
                    <TabsTrigger value="area">Area Chart</TabsTrigger>
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                  </TabsList>
                  <TabsContent value="area">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="actual" stackId="1" stroke="#8884d8" fill="#8884d8" name="Actual Sales" />
                        <Area type="monotone" dataKey="predicted" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Predicted Sales" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="line">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="actual" stroke="#8884d8" activeDot={{ r: 8 }} name="Actual Sales" strokeWidth={2} />
                        <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted Sales" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          {/* Product Demand Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Product Demand Forecast
              </CardTitle>
              <CardDescription>
                AI-based product demand predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productForecasts.map((forecast) => {
                  const product = products.find(p => p.id === forecast.id);
                  const stockPercentage = product ? (product.quantity / forecast.recommendedStock) * 100 : 0;
                  
                  return (
                    <div key={forecast.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{forecast.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>Current: {forecast.currentStock}</span>
                            <span className="mx-2">•</span>
                            <span>Recommended: {forecast.recommendedStock}</span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            forecast.trend === "increasing" 
                              ? "border-green-300 text-green-700 bg-green-50" 
                              : forecast.trend === "decreasing"
                                ? "border-red-300 text-red-700 bg-red-50"
                                : "border-blue-300 text-blue-700 bg-blue-50"
                          }
                        >
                          {forecast.trend === "increasing" && (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          )}
                          {forecast.trend === "decreasing" && (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {forecast.trend === "increasing" && "Rising Demand"}
                          {forecast.trend === "decreasing" && "Falling Demand"}
                          {forecast.trend === "stable" && "Stable Demand"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Current Stock</span>
                          <span>{Math.round(stockPercentage)}% of recommended</span>
                        </div>
                        <Progress 
                          value={stockPercentage > 100 ? 100 : stockPercentage} 
                          className={
                            stockPercentage < 30 
                              ? "bg-red-100"
                              : stockPercentage < 70
                                ? "bg-yellow-100"
                                : "bg-green-100"
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <LowStockAlert 
            products={products} 
            onOrderMore={(productId) => console.log("Order more of product:", productId)} 
          />
          
          {/* Category Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Sales by Category
              </CardTitle>
              <CardDescription>
                Distribution across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Top Selling Products
              </CardTitle>
              <CardDescription>
                Products with highest sales volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.salesCount} sold</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price * (product.salesCount || 0))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
