import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LowStockAlert } from "@/components/LowStockAlert";
import { useRetail } from "@/context/RetailContext";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { LineChart, Line } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, IndianRupee, BarChart as BarChartIcon, ArrowUpRight, ArrowDownRight, LogOut } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { 
    products, 
    bills, 
    getLowStockProducts, 
    getTopSellingProducts,
    getTotalRevenue,
    getTotalInventoryValue,
    salesData,
    categorySales,
    isLoading
  } = useRetail();

  const { signOut } = useAuth();

  const lowStockProducts = getLowStockProducts();
  const topSellingProducts = getTopSellingProducts();
  const totalRevenue = getTotalRevenue();
  const totalInventoryValue = getTotalInventoryValue();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Last 30 days",
      icon: <IndianRupee className="h-5 w-5 text-muted-foreground" />,
      change: "+12.5%",
      trend: "up" as const
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      description: "In inventory",
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
      change: "+3.2%",
      trend: "up" as const
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalInventoryValue),
      description: "Current stock",
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
      change: "-2.1%",
      trend: "down" as const
    },
    {
      title: "Total Sales",
      value: bills.length.toString(),
      description: "Completed transactions",
      icon: <BarChartIcon className="h-5 w-5 text-muted-foreground" />,
      change: "+5.7%",
      trend: "up" as const
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your retail data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                {card.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={card.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {card.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Tabs defaultValue="bar">
                  <TabsList className="mb-4">
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bar">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Sales']} 
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar dataKey="sales" fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="line">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Sales']} 
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Line type="monotone" dataKey="sales" stroke="#14b8a6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with highest sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-retail-100 flex items-center justify-center text-retail-700 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.salesCount} units sold</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <LowStockAlert products={products} />
          
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 5 completed sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills?.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{bill.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bill.createdAt).toLocaleDateString()} at {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="font-bold">{formatCurrency(bill.totalAmount)}</p>
                    </div>
                    <p className="text-sm mt-1">{bill.items?.length || 0} items • {bill.paymentMethod || 'N/A'}</p>
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
