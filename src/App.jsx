import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";

// Simple Dashboard Component
const Dashboard = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Billing Dashboard</h1>
    <p className="text-gray-600">Select an option from the menu to start.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <CustomerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <InvoicePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
