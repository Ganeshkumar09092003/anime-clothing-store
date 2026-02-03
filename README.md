# 🎌 Anime Clothing Store

A full-stack e-commerce application for anime-themed clothing built with **React + Vite** (Frontend) and **Node.js + Express + MongoDB** (Backend).

---

## 📐 Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                              │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     React + Vite Frontend                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │   │
│  │  │    Pages    │  │  Components │  │   Context   │  │  Services │   │   │
│  │  │  - Home     │  │  - Navbar   │  │ - AuthCtx   │  │  - api.js │   │   │
│  │  │  - Products │  │  - Footer   │  │ - CartCtx   │  │  (Axios)  │   │   │
│  │  │  - Cart     │  │  - Cards    │  │             │  │           │   │   │
│  │  │  - Admin    │  │  - Layout   │  │             │  │           │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/REST API
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         Node.js + Express Backend                          │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                            Middleware Layer                          │  │
│  │   CORS → Cookie Parser → JSON Parser → Auth → Role → Error Handler  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                              Routes                                  │  │
│  │   /auth  │  /products  │  /cart  │  /orders  │  /payments  │  /webhooks │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                            Controllers                               │  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │  │
│  │  │   Auth    │ │  Product  │ │   Cart    │ │   Order   │            │  │
│  │  │ Controller│ │ Controller│ │ Controller│ │ Controller│            │  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                              Models                                  │  │
│  │   User  │  Product  │  Cart  │  Order  │  RefreshToken  │  Idempotency │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│     MongoDB Atlas   │   │     Cloudinary      │   │   Stripe (Future)   │
│    (Data Storage)   │   │   (Image Storage)   │   │     (Payments)      │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 🗄️ Database Schema (MongoDB)

### User Model
```javascript
{
  name: String,          // User's display name
  email: String,         // Unique, lowercase email
  password: String,      // Bcrypt hashed (select: false)
  role: "user" | "admin" // Default: "user"
}
```

### Product Model
```javascript
{
  name: String,              // Product title
  description: String,       // Product details
  price: Number,             // Price in INR
  anime: String,             // "Naruto", "One Piece", etc.
  category: String,          // "Hoodie", "T-Shirt", etc.
  variants: [{               // Size-based inventory
    size: "S" | "M" | "L" | "XL",
    stock: Number
  }],
  images: [String],          // Cloudinary URLs
  isLimitedEdition: Boolean,
  createdBy: ObjectId → User
}
```

### Cart Model
```javascript
{
  user: ObjectId → User,     // One cart per user
  items: [{
    product: ObjectId → Product,
    size: "S" | "M" | "L" | "XL",
    quantity: Number,
    price: Number            // Snapshot at add time
  }]
}
```

### Order Model
```javascript
{
  user: ObjectId → User,
  items: [{                  // Snapshot of cart at checkout
    product: ObjectId,
    anime: String,
    category: String,
    size: String,
    quantity: Number,
    price: Number,
    image: { url, publicId }
  }],
  totalAmount: Number,
  status: "pending" | "paid" | "cancelled" | "failed",
  paymentIntentId: String    // Stripe reference
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          JWT Authentication Flow                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REGISTER (/auth/register)                                               │
│     ┌──────────┐  name, email, password  ┌──────────┐  hash password        │
│     │  Client  │ ─────────────────────▶  │  Server  │ ─────────────────▶ DB │
│     └──────────┘                         └──────────┘  create user          │
│                                                                             │
│  2. LOGIN (/auth/login)                                                     │
│     ┌──────────┐  email, password        ┌──────────┐                       │
│     │  Client  │ ─────────────────────▶  │  Server  │                       │
│     └──────────┘                         └──────────┘                       │
│          │                                    │                             │
│          │   Access Token (15min)             │ Generate tokens             │
│          │   + User Data (in response body)   │                             │
│          │◀───────────────────────────────────│                             │
│          │                                    │                             │
│          │   Refresh Token (7 days)           │                             │
│          │   (HTTP-Only Cookie)               │                             │
│          │◀───────────────────────────────────│                             │
│                                                                             │
│  3. AUTHENTICATED REQUESTS                                                  │
│     ┌──────────┐  Authorization: Bearer <accessToken>                       │
│     │  Client  │ ──────────────────────────────────────▶ Protected Routes   │
│     └──────────┘                                                            │
│                                                                             │
│  4. TOKEN REFRESH (/auth/refresh)                                           │
│     When access token expires (401 response):                               │
│     ┌──────────┐  Cookie: refreshToken   ┌──────────┐  new accessToken      │
│     │  Client  │ ─────────────────────▶  │  Server  │ ─────────────────▶    │
│     └──────────┘ (Axios interceptor)     └──────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Token Storage
| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access Token | localStorage | 15 min | API authorization |
| Refresh Token | HTTP-Only Cookie | 7 days | Get new access tokens |

---

## 📁 Project Structure

```
anime-clothing-store/
├── backend/
│   └── src/
│       ├── app.js                # Express app setup
│       ├── server.js             # Entry point, DB connection
│       ├── config/
│       │   ├── db.js             # MongoDB connection
│       │   └── env.js            # Environment config
│       ├── controllers/
│       │   ├── auth.controller.js    # Login, register, logout
│       │   ├── cart.controller.js    # Cart CRUD
│       │   ├── order.controller.js   # Order management
│       │   ├── payment.controller.js # Stripe integration
│       │   ├── product.controller.js # Product CRUD
│       │   └── webhook.controller.js # Stripe webhooks
│       ├── middlewares/
│       │   ├── auth.middleware.js      # JWT verification
│       │   ├── role.middleware.js      # Admin check
│       │   ├── upload.middleware.js    # Multer for images
│       │   ├── idempotency.middleware.js # Prevent duplicate orders
│       │   └── error.middleware.js     # Global error handler
│       ├── models/
│       │   ├── user.model.js
│       │   ├── product.model.js
│       │   ├── cart.model.js
│       │   ├── order.model.js
│       │   ├── RefreshToken.model.js
│       │   └── idempotency.model.js
│       ├── routes/
│       │   └── *.routes.js       # Route definitions
│       └── utils/
│           ├── cloudinary.js     # Image upload config
│           ├── token.js          # JWT generation
│           └── ApiError.js       # Custom error class
│
└── frontend/
    └── src/
        ├── App.jsx               # Routes & providers
        ├── main.jsx              # Entry point
        ├── components/
        │   ├── Layout.jsx        # Page wrapper with Navbar/Footer
        │   ├── ProtectedRoute.jsx # Auth guard
        │   ├── Navbar/
        │   ├── Footer/
        │   ├── ProductCard/
        │   └── Loading/
        ├── pages/
        │   ├── Home/             # Landing page
        │   ├── Products/         # Product listing
        │   ├── ProductDetail/    # Single product view
        │   ├── Cart/             # Shopping cart
        │   ├── Checkout/         # Payment page
        │   ├── Orders/           # Order history
        │   ├── Auth/             # Login & Register
        │   └── Admin/            # Product management
        ├── context/
        │   ├── AuthContext.jsx   # User state & auth methods
        │   └── CartContext.jsx   # Cart state & actions
        └── services/
            └── api.js            # Axios config & API calls
```

---

## 🔄 Data Flow Examples

### Adding to Cart
```
┌────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐    ┌─────────┐
│ ProductPage│───▶│ CartContext │───▶│   api.js    │───▶│ Backend  │───▶│ MongoDB │
│ (Add Btn)  │    │ addToCart() │    │ POST /cart  │    │Controller│    │  Cart   │
└────────────┘    └─────────────┘    └─────────────┘    └──────────┘    └─────────┘
       │                 │                                   │
       │                 │◀─────────── Updated Cart ─────────│
       │◀── Toast ───────│
```

### Checkout to Order
```
┌──────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────────────────────────┐
│ Checkout │───▶│ ordersAPI   │───▶│POST /orders │───▶│     Order Controller         │
│   Page   │    │  .create()  │    │             │    │ 1. Validate stock            │
└──────────┘    └─────────────┘    └─────────────┘    │ 2. Reserve inventory         │
                                                      │ 3. Create order (pending)    │
                                                      │ 4. Clear user cart           │
                                                      └──────────────────────────────┘
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **JWT Authentication** | Access + Refresh token pattern |
| **HTTP-Only Cookies** | Refresh tokens stored securely |
| **CORS Protection** | Whitelisted frontend origin only |
| **Role-Based Access** | Admin-only routes for product management |
| **Idempotency Keys** | Prevent duplicate order creation |
| **Input Validation** | Mongoose schema validation |

---

## 🚀 Quick Start

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔧 Environment Setup

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/anime-store
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📦 API Endpoints

### Auth Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create new user | ❌ |
| POST | `/login` | Login & get tokens | ❌ |
| POST | `/logout` | Invalidate refresh token | ✅ |
| POST | `/refresh` | Get new access token | Cookie |

### Product Routes (`/api/v1/products`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all products | ❌ |
| GET | `/:id` | Get single product | ❌ |
| POST | `/` | Create product (admin) | ✅ Admin |

### Cart Routes (`/api/v1/cart`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user's cart | ✅ |
| POST | `/` | Add item to cart | ✅ |
| PATCH | `/` | Update item quantity | ✅ |
| DELETE | `/` | Remove item from cart | ✅ |

### Order Routes (`/api/v1/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create order from cart | ✅ |
| GET | `/my-orders` | Get user's orders | ✅ |
| POST | `/:id/cancel` | Cancel pending order | ✅ |

---

## 🎨 Frontend State Management

### Context API Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    AuthProvider                       │  │
│  │  • user state     • login()    • logout()             │  │
│  │  • isAuthenticated • register() • isAdmin             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                  CartProvider                   │  │  │
│  │  │  • cart state      • addToCart()               │  │  │
│  │  │  • cartTotal       • updateCartItem()          │  │  │
│  │  │  • cartCount       • removeFromCart()          │  │  │
│  │  │  ┌───────────────────────────────────────────┐ │  │  │
│  │  │  │            Routes/Pages                   │ │  │  │
│  │  │  │  useAuth() hook → access auth state       │ │  │  │
│  │  │  │  useCart() hook → access cart state       │ │  │  │
│  │  │  └───────────────────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 How to Add Products

1. **Create admin account**: Register → In MongoDB Atlas, change `role: "user"` to `role: "admin"`
2. **Login**: Go to `/login` and enter admin credentials
3. **Navigate to Admin**: Click "Admin" in navbar or go to `/admin`
4. **Add Product**: Fill form with name, price, anime series, category, sizes, and upload image
5. **View Products**: Products appear on `/products` and homepage

---

**Made with ❤️ for anime fans!**
