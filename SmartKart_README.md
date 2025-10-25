# 🛒 SmartKart — Microservices Based E-Commerce Platform

**SmartKart** is a **scalable, cloud-ready e-commerce platform** built with a **microservices architecture**, designed for high availability, modularity, and performance.  
The system is composed of independently deployable services handling authentication, product catalog, shopping cart, orders, payments, notifications, and seller management — all communicating through REST APIs.

---

## 🚀 Key Highlights

- 🧩 **Modular Microservices** — Independent services for `Auth`, `Product`, `Cart`, `Order`, `Payment`, `Notification`, and `Seller Dashboard`.
- ⚡ **High Scalability** — Each service containerized via **Docker** and orchestrated using **Kubernetes**.
- 🔄 **Continuous Integration / Deployment (CI/CD)** — Automated pipelines through **GitHub Actions** for seamless updates.
- 🔐 **Secure Authentication & Authorization** — **JWT**-based token authentication and **role-based access control (RBAC)**.
- 🌐 **RESTful APIs** — Clean, versioned APIs for inter-service communication.
- 🧠 **Documentation & Testing** — Integrated **Swagger** for live API docs and **Postman** for testing.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT |
| **Containerization** | Docker |
| **Orchestration** | Kubernetes |
| **CI/CD** | GitHub Actions |
| **API Tools** | Swagger, Postman |

---

## 🧩 Microservices Overview

### 1. Auth Service
Handles user registration, login, JWT-based authentication, and address management.

### 2. Product Service
Manages product listings, categories, and search functionality with optimized indexing for fast retrieval.

### 3. Cart Service
Handles add-to-cart, remove-from-cart, and cart synchronization per authenticated user session.

### 4. Order Service
Processes customer orders, order tracking, and invoice generation.

### 5. Payment Service
Integrates payment gateway APIs for transaction management and secure checkout flow.

### 6. Notification Service
Sends real-time updates (email/SMS) for order confirmation, payment status, and delivery updates.

### 7. Seller Dashboard
A dedicated service for sellers to manage inventory, track orders, and view performance analytics.

---

## 🧠 Future Enhancements

- Integration with **AI Buddy Microservice** for intelligent user interaction (search product & add to cart using AI commands).
- Real-time analytics dashboard using **Socket.IO** and **Chart.js**.
- Advanced caching and rate limiting using **Redis**.
- Centralized logging and monitoring via **Prometheus + Grafana**.

---

## 📦 Setup & Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/smartkart.git
   cd smartkart
   ```

2. Install dependencies for each service  
   ```bash
   cd auth-service && npm install
   cd ../product-service && npm install
   # ... repeat for other services
   ```

3. Run services using Docker Compose  
   ```bash
   docker-compose up --build
   ```

4. Access APIs at  
   - `http://localhost:4000/api/auth`  
   - `http://localhost:4001/api/product`  
   - and so on...

---

## 🧾 API Documentation

Each microservice comes with integrated **Swagger** UI:  
Example:  
```
Auth Service → http://localhost:4000/api-docs
Product Service → http://localhost:4001/api-docs
```

---

## 🧍‍♂️ Author

**Aman Kumar**  
Full Stack Developer (MERN + DevOps)  
📧 [Email](mailto:your-email@example.com) | 💼 [LinkedIn](https://linkedin.com/in/amanpal287) | 🐙 [GitHub](https://github.com/Aman-Pal287)

---

> 🚀 SmartKart — Building the Future of Scalable Commerce.
