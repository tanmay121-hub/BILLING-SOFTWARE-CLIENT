import { useEffect, useState } from "react";
import { getProducts, saveProduct, deleteProduct } from "../services/api";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    gstPercentage: 18.0, // Default GST
  });

  // 1. Load Data on Page Load
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // 2. Handle Form Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await saveProduct(newProduct);
      loadProducts(); // Refresh list
      setNewProduct({
        name: "",
        price: "",
        stockQuantity: "",
        gstPercentage: 18.0,
      }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        loadProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Product Management
      </h2>

      {/* --- ADD PRODUCT FORM --- */}
      <form
        onSubmit={handleAddProduct}
        className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            placeholder="e.g. Wireless Mouse"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            placeholder="0.00"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            placeholder="0"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={newProduct.stockQuantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stockQuantity: e.target.value })
            }
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            + Add Product
          </button>
        </div>
      </form>

      {/* --- PRODUCT TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b text-right">Price</th>
              <th className="py-3 px-4 border-b text-center">GST %</th>
              <th className="py-3 px-4 border-b text-center">Stock</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No products found. Add one above!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{product.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-right">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {product.gstPercentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stockQuantity > 5
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(product.id)}
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

export default ProductPage;
