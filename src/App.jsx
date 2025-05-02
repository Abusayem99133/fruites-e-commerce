import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";

// Layout

// Pages
import HomePage from "@/pages/HomePage";
import FruitsListPage from "@/pages/FruitsListPage";
import FruitDetailPage from "@/pages/FruitDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import UserDashboard from "@/pages/dashboard/UserDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import SignUpSuccessPage from "@/pages/auth/SignUpSuccessPage";
import Layout from "./Components/Layouts/Layout";
import { Toaster } from "./Components/ui/sonner";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  // Simplified authentication check
  const isAuthenticated = localStorage.getItem("supabase.auth.token") !== null;
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="fruits" element={<FruitsListPage />} />
            <Route path="fruits/:id" element={<FruitDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route
              path="checkout"
              element={<ProtectedRoute element={<CheckoutPage />} />}
            />
            <Route
              path="dashboard"
              element={<ProtectedRoute element={<UserDashboard />} />}
            />
            <Route
              path="admin"
              element={<ProtectedRoute element={<AdminDashboard />} />}
            />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="signup-success" element={<SignUpSuccessPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
