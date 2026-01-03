import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Image,
  Ticket,
  Tag,
  ShoppingCart,
  Star,
  Bell,
  Home,
  Link2,
  Settings,
  Users,
  LogOut,
  FileText,
  Sliders,
  Menu,
  HelpCircle,
  Ruler,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Sliders, label: 'Product Options', path: '/admin/product-options' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: Layers, label: 'Collections', path: '/admin/collections' },
  { icon: Image, label: 'Banners', path: '/admin/banners' },
  { icon: Tag, label: 'Offers', path: '/admin/offers' },
  { icon: Ticket, label: 'Discount Codes', path: '/admin/discount-codes' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
  { icon: Home, label: 'Homepage', path: '/admin/homepage' },
  { icon: FileText, label: 'About Page', path: '/admin/about-page' },
  { icon: HelpCircle, label: 'FAQ', path: '/admin/faq' },
  { icon: Ruler, label: 'Size Guide', path: '/admin/size-guide' },
  { icon: Link2, label: 'Footer Links', path: '/admin/footer-links' },
  { icon: Menu, label: 'Navigation', path: '/admin/navigation' },
  { icon: Settings, label: 'Site Settings', path: '/admin/settings' },
  { icon: Users, label: 'Team', path: '/admin/team' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-card border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link to="/admin/dashboard">
          <h1 className="text-xl font-serif tracking-widest text-primary">SHARVA</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm mb-1 transition-colors ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;