import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { user, loading } = useAuth();
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

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex w-full">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;