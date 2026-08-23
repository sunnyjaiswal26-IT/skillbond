# Installation & Local Setup Guide

## Prerequisites
- Java 21 JDK
- Node.js 18+ and npm 10+
- MongoDB 7.0 (Running locally or via Docker)

---

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Verify or start MongoDB service on localhost:27017:
   ```bash
   mongod
   ```

3. Run Spring Boot application via Maven:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will start at `http://localhost:8080/api`.

---

## Frontend Setup

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The app will be accessible at `http://localhost:5173`.
