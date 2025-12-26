import { BarChart3, Package, ShoppingCart, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹12,45,000', change: '+12%', icon: BarChart3 },
    { label: 'Orders', value: '245', change: '+8%', icon: ShoppingCart },
    { label: 'Customers', value: '1,234', change: '+15%', icon: Users },
    { label: 'Products', value: '89', change: '+3%', icon: Package },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-green-600">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <p className="text-muted-foreground">
          This is a placeholder for the admin dashboard. Add your admin features here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;