# 🌱 EcoHub – Smart Ecosystem Management Platform

EcoHub is a comprehensive full-stack microservices-based application designed to promote sustainable living. It connects users with daily eco-friendly challenges, a reward system, a marketplace for sustainable products, and educational workshops.

The platform follows a modern **Microservices Architecture**, separating concerns into distinct services for scalability and maintainability.

---

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT authentication.
- **Daily Challenges**: Users can participate in daily eco-challenges to earn rewards.
- **Reward Wallet**: a digital wallet system to track and manage earned rewards.
- **Eco Shop**: A marketplace to redeem rewards or purchase sustainable products.
- **Workshops**: Educational sessions and workshops for community engagement.
- **Microservices Architecture**: Independent services for different functional areas.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn-ui
- **State Management**: React Hooks / Context

### Backend
The backend is built using a hybrid approach with **Node.js** and **Java Spring Boot**:

| Service | Tech Stack | Port | Description |
|---------|------------|------|-------------|
| **API Gateway** | Node.js, Express | 3000 | Central entry point, routing requests to microservices. |
| **Auth Service** | Node.js, Express, Prisma, MySQL | 5000 | User capability, authentication, and authorization. |
| **Daily Challenges** | Java, Spring Boot, MySQL | 8080 | Manages daily eco-challenges. |
| **Reward Wallet** | Java, Spring Boot, MySQL | 8081 | Manages user rewards and wallet balance. |
| **Shop** | Java, Spring Boot, MySQL | 8082 | Product catalog and order management. |
| **Workshop** | Java, Spring Boot, MySQL | 8083 | Manages educational workshops and events. |

### Infrastructure & Tools
- **Database**: MySQL (running via Docker)
- **Containerization**: Docker & Docker Compose
- **Build Tools**: npm (Node.js), Maven (Java)
- **Version Control**: Git

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18+)
- **Java JDK** (v17+) and verify `JAVA_HOME` is set.
- **Docker & Docker Compose** (for databases)
- **Maven** (optional, wrapper provided)

---

## 📥 Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EcoHub
```

### 2. Environment Setup
Run the setup script to configure environment variables and check dependencies.

**Windows (PowerShell):**
```powershell
./setup.ps1
```

**Windows (Command Prompt):**
```cmd
setup.bat
```

### 3. Start All Services
You can start all services (Docker containers, Backend microservices, and Frontend) with a single command:
```bash
npm start
# OR
node all-services.js
```

This script will:
1. Start MySQL containers via Docker.
2. Start the API Gateway and Auth Service.
3. Start all Spring Boot microservices (Challenges, Wallet, Shop, Workshop).
4. Start the React Frontend.

---

## 📡 API Endpoints

The **API Gateway** running at `http://localhost:3000` routes requests:

- `/auth/*` -> Auth Service
- `/challenges/*` -> Daily Challenges Service
- `/wallet/*` -> Reward Wallet Service
- `/shop/*` -> Shop Service
- `/workshops/*` -> Workshop Service

## 💻 Frontend

The frontend runs at: `http://localhost:5173`

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
