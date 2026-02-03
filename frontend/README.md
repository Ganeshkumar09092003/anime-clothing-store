# 🎌 Anime Clothing Store - Frontend

A modern React-based frontend for the Anime Clothing Store e-commerce application.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages](#-pages)
- [Components](#-components)
- [State Management](#-state-management)

---

## ✨ Features

- 🎨 **Modern Dark UI** - Premium anime-themed design with gradients and glassmorphism
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication** - Login, register with JWT token management
- 🛍️ **Product Catalog** - Browse products with filters (anime, category, size) and pagination
- 🛒 **Shopping Cart** - Add, update, remove items with real-time updates
- 📦 **Order Management** - View order history and cancel pending orders
- 💳 **Checkout Flow** - Complete checkout with shipping address form
- 🔄 **Auto Token Refresh** - Seamless authentication with axios interceptors
- 🔔 **Toast Notifications** - User-friendly feedback for all actions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |
| **Lucide React** | Icons |
| **CSS** | Styling (no framework) |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── Loading/
│   │   │   ├── Loading.jsx
│   │   │   └── Loading.css
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.css
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.css
│   │   ├── Cart/
│   │   │   ├── Cart.jsx
│   │   │   └── Cart.css
│   │   ├── Checkout/
│   │   │   ├── Checkout.jsx
│   │   │   └── Checkout.css
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── Orders/
│   │   │   ├── Orders.jsx
│   │   │   └── Orders.css
│   │   ├── ProductDetail/
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductDetail.css
│   │   └── Products/
│   │       ├── Products.jsx
│   │       └── Products.css
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd anime-clothing-store/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:5173`

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |

---

## 📄 Pages

### Public Pages

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with hero, collections, categories |
| `/products` | Products | Product listing with filters and pagination |
| `/products/:id` | Product Detail | Product info, size selection, add to cart |
| `/login` | Login | User login form |
| `/register` | Register | User registration form |

### Protected Pages (requires authentication)

| Path | Page | Description |
|------|------|-------------|
| `/cart` | Cart | View and manage shopping cart |
| `/checkout` | Checkout | Shipping address and order placement |
| `/orders` | Orders | View order history |

---

## 🧩 Components

### Layout Components
- **Navbar** - Navigation with auth state, cart badge
- **Footer** - Links, contact info, branding
- **Layout** - Wraps pages with Navbar/Footer

### UI Components
- **ProductCard** - Product display in grid
- **Loading** - Loading spinner
- **ProtectedRoute** - Auth-guarded route wrapper

---

## 🔄 State Management

### AuthContext
- User authentication state
- Login/Register/Logout functions
- Token storage in localStorage

### CartContext
- Cart items state
- Add/Update/Remove cart functions
- Cart total calculation
- Syncs with backend API

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server |
| **build** | `npm run build` | Build for production |
| **preview** | `npm run preview` | Preview production build |
| **lint** | `npm run lint` | Run ESLint |

---

## 🎨 Design System

### Colors
- **Primary**: `#ff6b9d` (Pink)
- **Secondary**: `#c44dff` (Purple)
- **Accent**: `#6366f1` (Indigo)
- **Background**: `#0a0a14` (Dark)

### Typography
- Font: Inter (Google Fonts)
- Weights: 400, 500, 600, 700, 800

### Effects
- Glassmorphism backgrounds
- Gradient text and buttons
- Hover animations
- Smooth transitions

---

**Made with ❤️ for anime fans!**
