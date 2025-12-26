import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      
      if (!data) {
        navigate('/access-denied');
      } else {
        setIsAdmin(true);
      }
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Package, label: 'Products', active: false },
    { icon: ShoppingCart, label: 'Orders', active: false },
    { icon: Users, label: 'Customers', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-serif tracking-widest text-primary">SHARVA</h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="px-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm mb-1 transition-colors ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3 w-64">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '₹12,45,000', change: '+12%' },
            { label: 'Orders', value: '245', change: '+8%' },
            { label: 'Customers', value: '1,234', change: '+15%' },
            { label: 'Products', value: '89', change: '+3%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
