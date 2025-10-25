# SmartKart - Microservices E-Commerce Platform

SmartKart is a scalable and modular e-commerce platform built using a microservices architecture. This project integrates multiple services such as product catalog, shopping cart, order management, payment gateway, notification system, and seller dashboard.

## 🔧 Features

- **Modular Microservices**: Separate services like `auth`, `cart`, `order`, `payment`, `product`, `notification`, and `seller-dashboard` ,`ai-buddy` .
- **RESTful APIs**: Each service exposes its own REST APIs.
- **Scalable Architecture**: Services are containerized using Docker and orchestrated with Kubernetes.
- **CI/CD Pipeline**: Automated build and deployment using GitHub Actions.
- **Authentication & Authorization**: JWT-based authentication and role-based access control.

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Authentication**: JWT
- **CI/CD**: GitHub Actions
- **Other Tools**: Swagger (API documentation), Postman (API testing)

🧩 Auth Service (User Authentication & Profile Management)
🔹 Base URL

/api/auth

1. 📝 Register User

Endpoint: POST /api/auth/register

Description:
Creates a new user account after validating input fields like name, email, and password.

Middlewares:

--validator.registerUserValidations

--validator.responseWithValidationErrors

Controller:

--authController.registerUser

Request Body (JSON):
{
"name": "Aman Kumar",
"email": "aman@example.com",
"password": "SecurePassword123"
}

Response (201 - Created):{
"success": true,
"message": "User registered successfully",
"data": {
"id": "652a4e1d92b5c1",
"email": "aman@example.com"
}
}

2. 🔐 Login User

Endpoint: POST /api/auth/login

Description:
Authenticates a user using email and password, and returns a JWT token for session management.

Middlewares:

- **validator.loginUserValidations**

- **validator.responseWithValidationErrors**

Controller:

- **authController.loginUser**
