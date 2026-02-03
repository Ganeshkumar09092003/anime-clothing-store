# 🎌 Anime Clothing Store

A full-stack e-commerce web application for anime-themed clothing built with React, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database Models](#-database-models)
- [Error Handling](#-error-handling)
- [Scripts](#-scripts)

---

## ✨ Features

- 🔐 **JWT Authentication** - Access & Refresh token based auth with secure cookie storage
- 👤 **User Management** - Registration, login, logout with role-based access (user/admin)
- 🛍️ **Product Catalog** - Browse products with filtering (anime, category, size) and pagination
- 🛒 **Shopping Cart** - Add, update, remove items with stock validation
- 📦 **Order Management** - Create orders, cancel orders, view order history
- 💳 **Payment Integration** - Payment intent creation with webhook support
- ☁️ **Cloudinary Integration** - Image upload for products
- 🔁 **Idempotency** - Prevents duplicate order/payment processing
- 🔒 **Security** - Password hashing with bcrypt, token rotation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image storage |
| **Multer** | File upload handling |
| **cookie-parser** | Cookie handling |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variables |
| **nodemon** | Development server |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment variables config
│   ├── constants/
│   │   └── index.js           # Application constants
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── cart.controller.js      # Cart operations
│   │   ├── health.controller.js    # Health check
│   │   ├── order.controller.js     # Order management
│   │   ├── payment.controller.js   # Payment processing
│   │   ├── product.controller.js   # Product CRUD
│   │   └── webhook.controller.js   # Payment webhooks
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── error.middleware.js     # Global error handler
│   │   ├── idempotency.middleware.js # Prevent duplicates
│   │   ├── role.middleware.js      # Role-based access
│   │   └── upload.middleware.js    # File upload config
│   ├── models/
│   │   ├── cart.model.js           # Cart schema
│   │   ├── idempotency.model.js    # Idempotency keys
│   │   ├── order.model.js          # Order schema
│   │   ├── product.model.js        # Product schema
│   │   ├── RefreshToken.model.js   # Refresh tokens
│   │   └── user.model.js           # User schema
│   ├── routes/
│   │   ├── auth.routes.js          # /api/v1/auth
│   │   ├── cart.routes.js          # /api/v1/cart
│   │   ├── health.routes.js        # /api/v1/health
│   │   ├── order.routes.js         # /api/v1/orders
│   │   ├── payment.routes.js       # /api/v1/payments
│   │   ├── product.routes.js       # /api/v1/products
│   │   └── webhook.routes.js       # /api/v1/webhooks
│   ├── utils/
│   │   ├── ApiError.js             # Custom error class
│   │   ├── cloudinary.js           # Cloudinary config
│   │   ├── fixIndexes.js           # DB index cleanup utility
│   │   ├── hash.js                 # Token hashing
│   │   ├── inventory.js            # Stock management
│   │   └── token.js                # JWT generation
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── nodemon.json                    # Nodemon config
├── package.json                    # Dependencies
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anime-clothing-store/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start production server**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

---

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>

# JWT Secrets (use strong, random strings in production!)
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_ACCESS_SECRET` | Secret for access tokens | Required |
| `JWT_ACCESS_EXPIRES` | Access token expiry | `15m` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Required |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry | `7d` |
| `CLOUDINARY_*` | Cloudinary credentials | Required for uploads |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Check API status | ❌ |
| GET | `/health/private` | Protected health check | ✅ |

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/refresh` | Refresh access token | 🍪 |
| POST | `/auth/logout` | Logout user | 🍪 |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products | ❌ |
| GET | `/products/:id` | Get single product | ❌ |
| POST | `/products` | Create product | ✅ Admin |

**Query Parameters for GET /products:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `anime` - Filter by anime name
- `category` - Filter by category
- `size` - Filter by size (S, M, L, XL)
- `sort` - Sort by price (`price` or `-price`)

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get user's cart | ✅ |
| POST | `/cart` | Add item to cart | ✅ |
| PATCH | `/cart` | Update cart item | ✅ |
| DELETE | `/cart` | Remove cart item | ✅ |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create order from cart | ✅ |
| GET | `/orders/my-orders` | Get user's orders | ✅ |
| GET | `/orders/all` | Get all orders | ✅ Admin |
| POST | `/orders/:orderId/cancel` | Cancel order | ✅ |
| POST | `/orders/:orderId/refund` | Refund order | ✅ Admin |

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payments/intent` | Create payment intent | ✅ |

### Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/webhooks/payment` | Handle payment webhook | ❌ |

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) with access and refresh token pattern:

### Token Flow

1. **Login** → Receive access token in response + refresh token in HTTP-only cookie
2. **API Requests** → Include access token in `Authorization: Bearer <token>` header
3. **Token Expired** → Call `/auth/refresh` to get new access token
4. **Logout** → Call `/auth/logout` to revoke refresh token

### Request Headers

```javascript
// For protected routes
headers: {
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json'
}

// For idempotent operations (orders/payments)
headers: {
  'Idempotency-Key': '<unique-uuid>'
}
```

### User Roles

| Role | Permissions |
|------|-------------|
| `user` | Browse products, manage cart, create orders |
| `admin` | All user permissions + create products, view all orders, refund orders |

---

## 🗄️ Database Models

### User
```javascript
{
  name: String,           // Required
  email: String,          // Required, unique, lowercase
  password: String,       // Required, min 6 chars, hashed
  role: "user" | "admin"  // Default: "user"
}
```

### Product
```javascript
{
  name: String,           // Required
  description: String,    // Required
  price: Number,          // Required
  anime: String,          // Required (e.g., "Naruto", "One Piece")
  category: String,       // Required (e.g., "Hoodie", "T-Shirt")
  variants: [{
    size: "S" | "M" | "L" | "XL",
    stock: Number
  }],
  images: [String],       // Cloudinary URLs
  isLimitedEdition: Boolean,
  createdBy: ObjectId     // Reference to User
}
```

### Cart
```javascript
{
  user: ObjectId,         // Reference to User
  items: [{
    product: ObjectId,    // Reference to Product
    size: String,
    quantity: Number,
    price: Number
  }]
}
```

### Order
```javascript
{
  user: ObjectId,         // Reference to User
  items: [{...}],         // Snapshot of cart items
  totalAmount: Number,
  status: "pending" | "paid" | "cancelled" | "failed",
  paymentIntentId: String
}
```

---

## ⚠️ Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development mode
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server with nodemon |
| **start** | `npm start` | Start production server |
| **fix-indexes** | `node src/utils/fixIndexes.js` | Clean up stale MongoDB indexes |

---

## 🧪 Testing API with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/v1/products?anime=Naruto&category=Hoodie
```

### Add to Cart (authenticated)
```bash
curl -X POST http://localhost:5000/api/v1/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"productId":"<product_id>","size":"M","quantity":1}'
```

---

## 🚧 Future Enhancements

- [ ] Stripe/Razorpay payment integration
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] API documentation with Swagger

---

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for anime fans!**
