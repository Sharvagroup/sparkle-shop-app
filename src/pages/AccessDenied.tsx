import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-3xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. If you believe this is an error, please contact the administrator.
        </p>

        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;
