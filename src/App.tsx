import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Collections from "./pages/admin/Collections";
import AdminProducts from "./pages/admin/Products";
import Banners from "./pages/admin/Banners";
import Offers from "./pages/admin/Offers";
import Orders from "./pages/admin/Orders";
import Reviews from "./pages/admin/Reviews";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin routes with shared layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="collections" element={<Collections />} />
              <Route path="banners" element={<Banners />} />
              <Route path="offers" element={<Offers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="announcements" element={<Dashboard />} />
              <Route path="homepage" element={<Dashboard />} />
              <Route path="footer-links" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
              <Route path="team" element={<Dashboard />} />
            </Route>
            
            <Route path="/access-denied" element={<AccessDenied />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
