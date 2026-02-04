import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Billing App</h1>
        <div className="flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/products" className="hover:text-blue-200 transition">
            Products
          </Link>
          <Link to="/customers" className="hover:text-blue-200 transition">
            Customers
          </Link>
          <Link to="/invoices" className="hover:text-blue-200 transition">
            Invoices
          </Link>

          <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-blue-400">
            <span className="text-sm opacity-80">Hi, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
