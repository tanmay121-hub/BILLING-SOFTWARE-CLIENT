import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { testLogin, register } from "../services/api"; // Import register

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle Register mode
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      // Handle Register
      try {
        await register({ username, password, role: "ADMIN" });
        alert("Registration Successful! Please login.");
        setIsRegistering(false);
      } catch (err) {
        setError("Registration failed. Try a different username.");
      }
    } else {
      // Handle Login
      login(username, password);
      try {
        // Test if these credentials actually work
        await testLogin();
        navigate("/"); // Go to Dashboard
      } catch (err) {
        setError("Invalid Username or Password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {isRegistering ? "Register Admin" : "Billing Login"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold transition"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
