import { useEffect, useState } from "react";
import {
  getCustomers,
  getProducts,
  createInvoice,
  getInvoices,
  downloadInvoicePdf,
  emailInvoice,
} from "../services/api";

const InvoicePage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [invoices, setInvoices] = useState([]);
  // Load Data on Start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const custRes = await getCustomers();
      const prodRes = await getProducts();
      const invRes = await getInvoices();
      setCustomers(custRes.data);
      setProducts(prodRes.data);
      setInvoices(invRes.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const addToCart = () => {
    if (!selectedProductId || quantity <= 0) return;

    const product = products.find((p) => p.id === parseInt(selectedProductId));

    // Check Stock
    if (product.stockQuantity < quantity) {
      alert(`Not enough stock! Only ${product.stockQuantity} left.`);
      return;
    }

    // Check if already in cart
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      alert("Product already in cart. Remove it to change quantity.");
      return;
    }

    const total = product.price * quantity;
    const tax = total * (product.gstPercentage / 100);

    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      gst: product.gstPercentage,
      quantity: parseInt(quantity),
      total: total,
      tax: tax,
    };

    setCart([...cart, newItem]);

    // Reset selection
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // --- SUBMIT INVOICE ---
  const handleGenerateInvoice = async () => {
    if (!selectedCustomerId || cart.length === 0) {
      alert("Please select a customer and add items.");
      return;
    }

    // Format data for Spring Boot Backend
    const invoiceRequest = {
      customerId: parseInt(selectedCustomerId),
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      discount: parseFloat(discount),
    };

    try {
      await createInvoice(invoiceRequest);
      alert("Invoice Created Successfully!");
      // Reset Page
      setCart([]);
      setSelectedCustomerId("");
      setDiscount(0);
      loadData();
    } catch (error) {
      console.error("Invoice Failed", error);
      alert("Failed to create invoice.");
    }
  };

  // Calculations for Preview
  const grandTotal = cart.reduce((acc, item) => acc + item.total + item.tax, 0);
  const finalPayable = grandTotal - discount;

  const handleDownload = async (id) => {
    try {
      const response = await downloadInvoicePdf(id);
      // Create a hidden link to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };
  const handleEmail = async (id) => {
    if (!window.confirm("Send invoice to customer via email?")) return;

    try {
      await emailInvoice(id);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Email failed", error);
      alert("Failed to send email. Check if customer has a valid email.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Invoice
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Customer
        </label>
        <select
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- Choose Customer --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                {p.name} - ₹{p.price} (Stock: {p.stockQuantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button
          onClick={addToCart}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-bold"
        >
          Add to Bill
        </button>
      </div>

      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="p-3 border-b">Product</th>
              <th className="p-3 border-b text-center">Qty</th>
              <th className="p-3 border-b text-right">Price</th>
              <th className="p-3 border-b text-right">Tax (GST)</th>
              <th className="p-3 border-b text-right">Total</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Cart is empty.
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="p-3 text-right text-red-600">
                    + ₹{item.tax.toFixed(2)} ({item.gst}%)
                  </td>
                  <td className="p-3 text-right font-bold">
                    ₹{(item.total + item.tax).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end border-t pt-4">
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (Inc. Tax):</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Discount:</span>
            <input
              type="number"
              className="w-24 p-1 border rounded text-right"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-2">
            <span>Grand Total:</span>
            <span>₹{finalPayable.toFixed(2)}</span>
          </div>

          <button
            onClick={handleGenerateInvoice}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition mt-4"
          >
            Generate Invoice
          </button>
        </div>
      </div>
      {/* --- INVOICE HISTORY --- */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Recent Invoices</h3>
        <table className="w-full text-left border-collapse bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="p-3">{inv.id}</td>
                <td className="p-3">{inv.customer.name}</td>
                <td className="p-3">
                  {new Date(inv.invoiceDate).toLocaleDateString()}
                </td>
                <td className="p-3 font-bold">Rs {inv.finalAmount}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleDownload(inv.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleEmail(inv.id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                  >
                    Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicePage;
