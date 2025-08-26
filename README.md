# Product-inventory
# 📦 Product Inventory Management System  

A full-stack **Node.js + Express + MongoDB** web application for managing products with authentication, authorization, and third-party API integration.  

🚀 Live Demo: [Product Inventory on Render](https://product-inventory-b1gd.onrender.com/products)  

---

## ✨ Features  

- 👤 **User Authentication & Authorization**  
  - Register, Login, Logout with **Passport.js**  
  - Only logged-in users can add, update, or delete products  
  - Authorization ensures only the product owner can modify/delete their products  

- 📦 **Product Management (CRUD)**  
  - Add new products with details (name, price, quantity, category)  
  - Edit existing products  
  - Delete products  
  - View all products or a single product  

- 💰 **Currency Conversion (3rd Party API Integration)**  
  - Product price shown in **INR, USD, and EUR** using [ExchangeRate API](https://open.er-api.com/v6/latest/INR)  

- 🔎 **Search & Filter**  
  - Search products by name directly from the **navbar**  

- 📱 **Responsive UI**  
  - Mobile-friendly design with Bootstrap  
  - Flash messages for success & error notifications  

- ✅ **Schema Validation**  
  - Input validation using **Joi**  
  - Prevents invalid product data from being stored  

---

## 🛠️ Tech Stack  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas for deployment)  
- **Authentication:** Passport.js (Local Strategy)  
- **Templating Engine:** EJS with ejs-mate layouts  
- **Styling:** Bootstrap 5 + custom CSS  
- **Validation:** Joi  
- **Flash Messages:** connect-flash  
- **Deployment:** Render  

---

## ⚙️ Installation  

1. **Clone the repo**  
```bash
git clone https://github.com/lalitsain03/product-inventory.git
cd product-inventory


##install dependencies
npm install

## Create .env file in the project root
MONGO_URL=your-mongodb-atlas-url
SESSION_SECRET=your-secret-key


## folder Structure
project/
│── models/          # Mongoose schemas (User, Product)
│── routes/          # Express routes (userRoutes, productRoutes)
│── views/           # EJS templates
│── public/          # Static files (CSS, JS)
│── utils/           # Helper functions (ExpressError, wrapAsync)
│── middleware.js    # Custom middlewares
│── server.js        # Main entry point
│── package.json
│── README.md
