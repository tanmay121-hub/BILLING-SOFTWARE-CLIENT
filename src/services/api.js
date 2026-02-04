import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { authHeader } = JSON.parse(storedUser);
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getProducts = () => api.get(`/products`);
export const saveProduct = (product) => api.post(`/products/add`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCustomers = () => api.get(`/customers`);
export const saveCustomer = (customer) => api.post(`/customers`, customer);

export const createInvoice = (invoiceRequest) =>
  api.post(`/invoices`, invoiceRequest);
export const getInvoices = () => api.get(`/invoices`);

export const register = (user) => axios.post(`${API_URL}/auth/register`, user);
export const testLogin = () => api.get(`/products`);

export const downloadInvoicePdf = (id) =>
  api.get(`/invoices/${id}/pdf`, { responseType: "blob" });

export const emailInvoice = (id) => api.post(`/invoices/${id}/email`);
