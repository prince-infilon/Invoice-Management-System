# Invoice Management System 

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) for managing clients and invoices. It provides a user-friendly interface to create, edit, view, and print professional invoices.

## Features
- **Client Management:** Add and manage client details.
- **Invoice Generation:** Create custom invoices with dynamic item lists, quantities, prices, and per-item discounts.
- **Printable Invoices:** High-quality, print-ready invoice layouts with custom business branding and logos.
- **Dashboard Overview:** Track invoices and view client information.
- **Responsive Design:** Optimized for various screen sizes.

## Tech Stack
### Frontend
- **React.js** (built with Vite)
- **React Router DOM** for routing
- **Bootstrap** for responsive styling
- **Axios** for API requests

### Backend
- **Node.js & Express.js** for the server environment
- **MongoDB & Mongoose** for the database and object modeling
- **CORS & dotenv** for security and environment configuration

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/prince-infilon/Invoice-Management-System.git
   cd Invoice-Management-System
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   - Create a `.env` file in the `Backend` directory based on `.env.example` and add your MongoDB connection string:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd Frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
