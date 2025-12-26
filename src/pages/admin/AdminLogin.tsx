import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, UserPlus, LogIn } from 'lucide-react';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const AdminLogin = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const { data: isVerified } = await supabase.rpc('is_admin_verified', {
          _user_id: user.id,
        });
        
        if (isVerified) {
          navigate('/admin/dashboard');
        }
      }
    };
    
    checkAdminRole();
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      setLoading(false);
      toast({
        title: 'Sign in failed',
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password.' 
          : error.message,
        variant: 'destructive',
      });
      return;
    }

    // Check if user is a verified admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: authUser.id,
        _role: 'admin',
      });

      if (!isAdmin) {
        setLoading(false);
        await supabase.auth.signOut();
        navigate('/access-denied');
        return;
      }

      const { data: isVerified } = await supabase.rpc('is_admin_verified', {
        _user_id: authUser.id,
      });

      setLoading(false);

      if (isVerified) {
        toast({ title: 'Welcome, Admin!' });
        navigate('/admin/dashboard');
      } else {
        await supabase.auth.signOut();
        toast({
          title: 'Account pending verification',
          description: 'Your admin account is awaiting verification. Please contact the administrator.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signUpSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    
    // First sign up the user
    const { error: signUpError } = await signUp(email, password, fullName);
    
    if (signUpError) {
      setLoading(false);
      toast({
        title: 'Registration failed',
        description: signUpError.message,
        variant: 'destructive',
      });
      return;
    }

    // Get the newly created user
    const { data: { user: newUser } } = await supabase.auth.getUser();
    
    if (newUser) {
      // Add admin role (unverified by default)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.id,
          role: 'admin',
          is_verified: false,
        });

      if (roleError) {
        // If role already exists (from trigger), update it to admin
        await supabase
          .from('user_roles')
          .update({ role: 'admin', is_verified: false })
          .eq('user_id', newUser.id);
      }
    }

    // Sign out after registration
    await supabase.auth.signOut();

    setLoading(false);
    toast({
      title: 'Registration successful!',
      description: 'Your admin account has been created and is pending verification. You will be notified once approved.',
    });
    
    // Reset form and switch to sign in
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMode('signin');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setErrors({});
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-center mb-2">
            {mode === 'signin' ? 'Admin Portal' : 'Admin Registration'}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {mode === 'signin' 
              ? 'Sign in to access the admin dashboard' 
              : 'Create an admin account (requires verification)'}
          </p>

          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={errors.password ? 'border-destructive' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                mode === 'signin' ? 'Signing in...' : 'Creating account...'
              ) : (
                <>
                  {mode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'signin' 
                ? "Don't have an admin account? Register" 
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> After registration, your account will require manual verification before you can access the admin dashboard.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          This is a restricted area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
