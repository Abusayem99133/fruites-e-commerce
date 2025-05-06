import { useState, useEffect } from "react";
import { getOrders } from "@/lib/supabase";
import { useAuth } from "@/Contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ShoppingBag, Calendar, ArrowUpRight } from "lucide-react";

function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("user name", user);
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      setLoading(true);
      const { orders, error } = await getOrders(user.id);

      if (error) {
        console.error("Error loading orders:", error);
      } else {
        setOrders(orders || []);
      }

      setLoading(false);
    };

    loadOrders();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Prepare data for fruit purchases chart
  const prepareFruitData = () => {
    const fruitCounts = {};

    orders.forEach((order) => {
      order.order_items.forEach((item) => {
        const fruitName = item.fruits.name;
        if (fruitCounts[fruitName]) {
          fruitCounts[fruitName] += item.quantity;
        } else {
          fruitCounts[fruitName] = item.quantity;
        }
      });
    });

    return Object.entries(fruitCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Prepare data for monthly spending chart
  const prepareMonthlyData = () => {
    const monthlySpending = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (monthlySpending[monthYear]) {
        monthlySpending[monthYear] += order.total_amount;
      } else {
        monthlySpending[monthYear] = order.total_amount;
      }
    });

    return Object.entries(monthlySpending).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  const fruitData = prepareFruitData();
  const monthlyData = prepareMonthlyData();

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Skeleton className="h-96 w-full" />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime orders placed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(
                  orders.reduce((total, order) => total + order.total_amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Order</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.length > 0
                  ? formatDate(orders[0].created_at)
                  : "No orders yet"}
              </div>
              <p className="text-xs text-muted-foreground">
                {orders.length > 0 ? orders[0].status : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders and Analytics */}
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View all your previous orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>
                            {order.order_items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(order.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Purchased Fruits */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Purchased Fruits</CardTitle>
                  <CardDescription>
                    Your most frequently purchased items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fruitData.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No purchase data available yet.
                      </p>
                    </div>
                  ) : (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={fruitData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="count"
                            label={(entry) => entry.name}
                          >
                            {fruitData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              `${value} units`,
                              "Quantity",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Spending */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                  <CardDescription>
                    Your purchase trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyData.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No spending data available yet.
                      </p>
                    </div>
                  ) : (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              formatPrice(value),
                              "Amount",
                            ]}
                          />
                          <Legend />
                          <Bar
                            dataKey="amount"
                            fill="#34D399"
                            name="Spending"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserDashboard;
