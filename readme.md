# SmartKart Microservices API Documentation

Welcome to the API documentation for SmartKart, a modern, scalable e-commerce platform built with a Microservices Architecture and the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

This document is tailored for the frontend development team to ensure seamless integration and understanding of the exposed APIs.

## 📦 Project Overview (Microservices Architecture)

SmartKart is built using 8 modular microservices, communicating primarily via **REST APIs** for synchronous requests and a **Message Broker (RabbitMQ)** for asynchronous communication (notifications, data synchronization).

| Service | Purpose | Base Path | Port (Local Dev) | Key Functionality |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | User Authentication and Authorization | `/api/auth` | `3000` | User registration, login, logout, and address management. |
| **Product** | Product Catalog Management | `/api/products` | `3001` | CRUD operations for products, search, and filtering. |
| **Cart** | Shopping Cart Logic | `/api/cart` | `3002` | Add, remove, update, and fetch user's shopping cart items. |
| **Order** | Order Processing and Management | `/api/orders` | `3003` | Create, retrieve, cancel, and update shipping details for an order. |
| **Payment**| Payment Gateway Integration (Razorpay) | `/api/payments` | `3004` | Initiate and verify online payments. |
| **AI-Buddy**| Conversational AI Assistant | (WebSocket) | `3005` | AI-powered product search and cart interaction. |
| **Notification**| Asynchronous Email and System Alerts | (Internal Broker) | `3006` | Sends emails on events (e.g., user created, payment status). |
| **Seller-Dashboard**| Seller Metrics and Inventory Tracking | `/api/seller/dashboard` | `3007` | Fetches sales metrics, seller orders, and product inventory. |

## 🛠️ Technology Stack (Backend)

* **Runtime:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens)
* **Messaging:** RabbitMQ (for inter-service communication)
* **Containerization:** Docker (for deployment/orchestration)

## 🔑 Authentication Flow & Guidelines

Authentication is handled via the **Auth Service** and uses **JSON Web Tokens (JWT)**.

1.  **Login/Registration:** The frontend calls the `POST /api/auth/login` or `POST /api/auth/register` endpoints on the Auth service.
2.  **Token Issuance:** On successful authentication, the backend sends a JWT in a secure **HTTP-only cookie** named `token`.
3.  **API Authorization:** For all subsequent requests to *protected routes* on other services (`Product`, `Cart`, `Order`, `Payment`, `Seller-Dashboard`), the JWT will be automatically included by the browser in the `Cookie` header.
    * **Note for Frontend:** If the cookie mechanism is not preferred for cross-origin requests, ensure that you are sending the token in the `Authorization` header as `Bearer <token>`. The backend is configured to accept both methods.

### Standard Authentication Types:

APIs are protected using a common middleware and check for one of the following user roles:
* **`user`**: For general customers (e.g., creating orders, managing cart).
* **`seller`**: For merchants managing products and checking sales metrics.
* **`admin`**: (Currently not extensively used, but defined for future extensibility).

***

## 🌐 API Endpoints (Core Services)

The documentation below uses the base URL: `http://localhost:[PORT]` (where `[PORT]` is the service's local development port).

### 1. Auth Service (Port: 3000)

| HTTP Method | Endpoint | Description | Auth | Validation (Key Fields) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new user (role: `user` or `seller`). | No | `username` (min 3 chars), `email` (valid), `password` (min 6 chars), `fullName` |
| `POST` | `/api/auth/login` | Authenticates a user. | No | `email` or `username`, `password` (min 6 chars) |
| `GET` | `/api/auth/me` | Retrieves the current authenticated user's details. | Yes | - |
| `GET` | `/api/auth/logout` | Clears the authentication cookie (`token`). | No | - |
| `GET` | `/api/auth/me/addresses` | Fetches all saved shipping addresses for the user. | Yes | - |
| `POST` | `/api/auth/me/addresses` | Adds a new address to the user's profile. | Yes | **Request Body:** `street`, `city`, `state`, `country`, `pincode`, `phone` (optional, 10 digits) |
| `DELETE` | `/api/auth/me/addresses/:addressId` | Deletes a specific address. | Yes | - |

### 2. Product Service (Port: 3001)

| HTTP Method | Endpoint | Description | Auth | Details |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/products` | Creates a new product. Supports image upload (up to 5 files). | Yes (`seller`, `admin`) | **Request Body:** `title`, `description`, `priceAmount`, `priceCurrency` (Optional, default `INR`). |
| `GET` | `/api/products` | Fetches all products with filtering/search. | No | **Query Params:** `q` (search term), `minprice`, `maxprice`, `skip`, `limit`. |
| `GET` | `/api/products/:id` | Retrieves a single product by ID. | No | - |
| `PATCH`| `/api/products/:id` | Updates an existing product (e.g., title, description, price). | Yes (`seller`) | - |
| `DELETE`| `/api/products/:id` | Deletes a product. | Yes (`seller`) | - |

### 3. Cart Service (Port: 3002)

| HTTP Method | Endpoint | Description | Auth | Details |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Retrieves the entire shopping cart content and totals. | Yes (`user`) | - |
| `POST` | `/api/cart/items` | Adds a new product to the cart. | Yes (`user`) | **Request Body:** `productId` (ObjectId), `qty` (Quantity, integer > 0). |
| `PATCH` | `/api/cart/items/:productId` | Updates the quantity of a specific item in the cart. | Yes (`user`) | **Request Body:** `qty` (New Quantity, integer > 0). |
| `DELETE` | `/api/cart/items/:productId` | Removes a specific item from the cart. | Yes (`user`) | - |
| `DELETE` | `/api/cart` | Clears the entire shopping cart. | Yes (`user`) | - |

### 4. Order Service (Port: 3003)

| HTTP Method | Endpoint | Description | Auth | Details |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Creates a new order from the current user's cart. | Yes (`user`) | **Request Body:** `shippingAddress` (Object with required address fields). |
| `GET` | `/api/orders/me` | Fetches a list of orders for the authenticated user (paginated). | Yes (`user`) | **Query Params:** `page` (optional), `limit` (optional). |
| `GET` | `/api/orders/:id` | Retrieves a single order by ID. | Yes (`user`, `admin`) | - |
| `POST` | `/api/orders/:id/cancel` | Cancels a PENDING order. | Yes (`user`) | - |
| `PATCH`| `/api/orders/:id/address` | Updates the shipping address for a PENDING order. | Yes (`user`) | **Request Body:** `shippingAddress` (Object with required address fields). |

### 5. Payment Service (Port: 3004)

| HTTP Method | Endpoint | Description | Auth | Details |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create/:orderId` | Initiates a payment process for a specific order. | Yes (`user`) | Returns the required Razorpay Order ID to initiate the payment widget. |
| `POST` | `/api/payments/verify` | Verifies the payment signature after gateway completion. | Yes (`user`) | **Request Body:** `razorpayOrderId`, `paymentId`, `signature`. |

### 6. Seller-Dashboard Service (Port: 3007)

| HTTP Method | Endpoint | Description | Auth | Details |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/seller/dashboard/metrics` | Retrieves sales, revenue, and top products data for the seller. | Yes (`seller`) | - |
| `GET` | `/api/seller/dashboard/orders` | Fetches all orders relevant to the seller's products. | Yes (`seller`) | - |
| `GET` | `/api/seller/dashboard/products` | Fetches the inventory list of products managed by the seller. | Yes (`seller`) | - |

## 💬 AI-Buddy Service (Port: 3005)

This service is a conversational AI assistant that operates via **WebSockets** (Socket.IO).

* **Protocol:** WebSocket (`ws://localhost:3005`)
* **Authentication:** Requires an authenticated `token` to be passed via an HTTP-only cookie during the handshake for user identification.
* **Functionality:** The AI can perform tool-assisted actions based on natural language input, including searching for products and adding items to the user's cart.

| Event | Direction | Data | Description |
| :--- | :--- | :--- | :--- |
| `connection` | Incoming | - | User connects, authentication token is verified in the middleware. |
| `message` | Incoming | `string` (User Query) | User sends a message (e.g., "Show me the cheapest laptop" or "Add product X to my cart"). |
| `message` | Outgoing | `string` (AI Response) | AI responds to the user query, potentially after calling an internal tool (like `searchProduct` or `addProductToCart`). |

## 📢 Notification Service (Port: 3006)

This service has no exposed REST APIs and only handles **asynchronous messaging** from the RabbitMQ Message Broker.

* **Primary Function:** Sends emails to users for system events (e.g., Welcome, Order Status Update, Payment Status).
* **Frontend Impact:** No direct API calls are needed for this service. Notifications are triggered internally by events occurring within other services (e.g., Auth, Order, Payment).






