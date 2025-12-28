import { BarChart3, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_COLORS } from '@/lib/constants';

const Dashboard = () => {
  // Fetch real stats from database
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Total revenue (paid orders)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('payment_status', 'paid');

      const currentMonthRevenue = revenueData?.filter(o => new Date(o.created_at) >= startOfMonth)
        .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      
      const lastMonthRevenue = revenueData?.filter(o => {
        const date = new Date(o.created_at);
        return date >= startOfLastMonth && date <= endOfLastMonth;
      }).reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const revenueChange = lastMonthRevenue > 0 
        ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) 
        : 0;

      // Orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: currentMonthOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      const { count: lastMonthOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      const ordersChange = lastMonthOrders && lastMonthOrders > 0 
        ? Math.round((((currentMonthOrders || 0) - lastMonthOrders) / lastMonthOrders) * 100) 
        : 0;

      // Customers count
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Products count
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      return {
        revenue: { total: totalRevenue, change: revenueChange },
        orders: { total: totalOrders || 0, change: ordersChange },
        customers: { total: totalCustomers || 0 },
        products: { total: totalProducts || 0 },
      };
    },
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select(`
          id, 
          order_number, 
          total_amount, 
          status, 
          payment_status, 
          created_at,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  };

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: stats?.revenue.total || 0, 
      change: stats?.revenue.change || 0, 
      icon: BarChart3,
      format: 'currency'
    },
    { 
      label: 'Orders', 
      value: stats?.orders.total || 0, 
      change: stats?.orders.change || 0, 
      icon: ShoppingCart,
      format: 'number'
    },
    { 
      label: 'Customers', 
      value: stats?.customers.total || 0, 
      change: null, 
      icon: Users,
      format: 'number'
    },
    { 
      label: 'Products', 
      value: stats?.products.total || 0, 
      change: null, 
      icon: Package,
      format: 'number'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-2xl font-semibold">
                  {stat.format === 'currency' 
                    ? formatCurrency(stat.value) 
                    : stat.value.toLocaleString()}
                </p>
                {stat.change !== null && (
                  <p className={`text-sm flex items-center gap-1 ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change >= 0 ? '+' : ''}{stat.change}% from last month
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        {ordersLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{order.order_number}</td>
                    <td className="py-3 text-muted-foreground">
                      {(order.profiles as { full_name?: string } | null)?.full_name || 'Guest'}
                    </td>
                    <td className="py-3">{formatCurrency(Number(order.total_amount))}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
