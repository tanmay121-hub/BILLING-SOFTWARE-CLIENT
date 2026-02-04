
#  This Repo is Frontend of Billing & Invoicing System 
**Full Stack Billing & Invoicing System**  
A robust, enterprise-grade Billing Software designed to manage customers, products, and invoices efficiently. Built with a **Spring Boot** backend and a **React + Tailwind** frontend, it features secure authentication, PDF generation, and automated email dispatch.

---

## Key Features

* **Secure Authentication:** User registration and login using **Spring Security** (Basic Auth) with **BCrypt** password encryption.
* **Inventory Management:** Real-time stock tracking. Prevents billing if stock is insufficient.
* **Customer Management:** maintain a directory of customer details for quick billing.
* **Smart Invoicing:** Add multiple items, calculate taxes (GST), apply discounts, and generate grand totals automatically.
* **PDF Generation:** Instantly generate professional PDF invoices using **OpenPDF**.
* **Email Automation:** Send invoices directly to customers via email using **JavaMailSender** (SMTP).
* **Modern UI:** A clean, responsive interface built with **React** and **Tailwind CSS**.

---

## Tech Stack

### **Backend (Spring Boot)**

* **Framework:** Spring Boot (Web, Data JPA, Security, Mail)
* **Database:** MySQL
* **Security:** Spring Security & BCrypt
* **PDF Engine:** OpenPDF (LibrePDF)
* **Tools:** Maven, Lombok, DevTools

### **Frontend (React)**

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios (with Interceptors for Auth)
* **Routing:** React Router DOM

---

##  Installation & Setup Guide

### **1. Database Setup**

Make sure you have MySQL installed.

```sql
CREATE DATABASE billingSoftware;

```

*No need to create tables manually! The application uses JPA (`ddl-auto=update`) to generate the schema automatically.*

### **2. Backend Setup**

1. Clone the repository.
2. Navigate to the backend folder.
3. Open `src/main/resources/application.properties` and update your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billingSoftware
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Email Settings (For Gmail, use App Password)
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD

```


4. Run the application:
```bash
mvn spring-boot:run

```



### **3. Frontend Setup**

1. Navigate to the frontend folder.
2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```


4. Open `http://localhost:5173` in your browser.

---

##  Usage Guide

### **Step 1: First Time Setup (Registration)**

Since the system is secure, you cannot log in immediately.

1. Go to the Login Page.
2. Click **"Need an account? Register"**.
3. Create an Admin user (e.g., `admin` / `password123`).
4. Log in with these credentials.

### **Step 2: Managing Data**

* **Products:** Go to the Products tab. Add items like "Laptop", "Mouse". Set the Price and Stock.
* **Customers:** Go to the Customers tab. Add a customer with a valid email (to test email functionality).

### **Step 3: Creating an Invoice**

1. Navigate to **Invoices**.
2. Select a Customer from the dropdown.
3. Select Products and Quantities. (Stock is checked automatically).
4. Click **"Generate Invoice"**.

### **Step 4: Output**

* **Download:** Click the **PDF** button in the invoice history to save the file.
* **Email:** Click the **Email** button to send the PDF to the customer's inbox automatically.

---

##  API Endpoints (Backend)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/auth/register` | Register a new user | ❌ No |
| **GET** | `/products` | Get all products | ✅ Yes |
| **POST** | `/products/add` | Add a new product | ✅ Yes |
| **GET** | `/customers` | Get all customers | ✅ Yes |
| **POST** | `/invoices` | Create a new invoice | ✅ Yes |
| **GET** | `/invoices/{id}/pdf` | Download Invoice PDF | ✅ Yes |
| **POST** | `/invoices/{id}/email` | Email Invoice to Customer | ✅ Yes |

---

##  Future Improvements

* [ ] Add Dashboard Analytics (Charts & Graphs).
* [ ] Role-Based Access Control (Admin vs. Staff).
* [ ] Edit/Update capabilities for existing Invoices.
* [ ] Payment Gateway Integration (Stripe/Razorpay).

---

### 👨‍💻 Author

**Tanmay Patil** - Java Full Stack Developer
*Aspiring to build scalable, enterprise-level applications.*
