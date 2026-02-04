import { useEffect, useState } from "react";
import { getCustomers, saveCustomer } from "../services/api";
import axios from "axios";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Load Data
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  // Handle Add Customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await saveCustomer(newCustomer);
      loadCustomers();
      setNewCustomer({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This might fail if the customer has existing invoices.",
      )
    ) {
      try {
        await axios.delete(`http://localhost:8080/customers/${id}`);
        loadCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Cannot delete customer. They likely have linked invoices.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Management
      </h2>

      <form
        onSubmit={handleAddCustomer}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200"
      >
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Tanmay Patil"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            placeholder="1234567890"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="tanmaypatil.dev@gmail.com"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            placeholder="City, State"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newCustomer.address}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, address: e.target.value })
            }
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            + Add Customer
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Phone</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Address</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{customer.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {customer.name}
                  </td>
                  <td className="py-3 px-4">{customer.phone}</td>
                  <td className="py-3 px-4 text-blue-600">{customer.email}</td>
                  <td className="py-3 px-4">{customer.address}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
