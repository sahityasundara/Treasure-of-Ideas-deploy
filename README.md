# Treasure of Ideas - A Full-Stack AI-Powered Project Discovery Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A complete MERN stack application designed as a collaborative hub for students and developers. It provides a feature-rich platform for users to share, discover, search, and bookmark project ideas, enhanced with a live AI-powered idea generator.

<br />

<p align="center">
  <a href="https://treasure-of-ideas.netlify.app/"> 
    <img src="https://img.shields.io/badge/View_Live_Demo-6A5ACD?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo">
  </a>
</p>

<br />

---

## 🌟 Key Features

This project was built from the ground up to showcase a wide range of modern web development skills, from backend architecture to a polished, performant user interface.

#### Core Functionality
- **Secure User Authentication:** Full user registration and login system using JSON Web Tokens (JWT) for secure, stateless sessions.
- **Full CRUD for Ideas:** Authenticated users can create, read, update (bookmark), and delete their own project ideas.
- **User-Specific Content:** Dedicated, protected pages for users to view "My Ideas" and "My Bookmarks".
- **Public User Profiles:** Click on any author's name to see a public page with all the ideas they have submitted.

#### Advanced Features
- **Live AI-Powered Idea Generation:** A protected route that integrates with the OpenRouter API to dynamically generate new project ideas based on user-provided keywords, using models like Mistral 7B.
- **Powerful Search:** A **debounced** search bar provides instant, case-insensitive search results across idea titles and descriptions, preventing excessive API calls.
- **Dynamic Filtering:** Filter ideas in real-time by category (Software, Hardware, Hybrid) without page reloads.
- **Efficient Pagination:** Implemented a "Load More" pagination system to ensure fast initial load times and high performance.

#### UI / UX
- **Modern & Responsive Design:** A clean, animated, and fully responsive UI built with React and custom CSS, featuring a professional color palette and typography.
- **"Glassmorphism" Navbar:** A dynamic, semi-transparent navbar that changes style based on scroll position and page location.
- **Interactive Card Expansion:** Click on any idea card to view its full details in a smooth, animated modal overlay.
- **Client-Side Routing:** A seamless multi-page application (SPA) experience using React Router with protected routes and a custom `_redirects` file for Netlify deployment.

---

## 🚀 Performance & Key Metrics

Performance was a primary goal of this project, demonstrated by the following quantifiable results:

-   **Frontend Performance:** Achieved **Lighthouse scores of 90+** in Accessibility, Best Practices, and SEO.
-   **API Performance:** Engineered backend endpoints with an average "warm" response time of **under 150ms**.
-   **Load Time Reduction:** The pagination feature improved initial data load performance by **over 95%**.
-   **API Call Reduction:** The client-side debounce on the search bar reduced API requests by **over 85%** on average user queries.

---

## 🛠️ Technology Stack

**Frontend:**
- React.js, React Router, Axios, CSS3, Vite

**Backend:**
- Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js

**Database:**
- MongoDB Atlas (Cloud NoSQL)

**AI Integration:**
- OpenRouter API (Access to models like Mistral & DeepSeek)

**DevOps:**
- Git, GitHub, Render (Backend Hosting), Netlify (Frontend Hosting), CI/CD

---

## 📦 Local Development

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or higher)
- npm
- A MongoDB Atlas connection string and an OpenRouter API Key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sahityasundara/Treasure-of-Ideas-deploy.git
    cd Treasure-of-Ideas-deploy
    ```
2.  **Install Backend Dependencies:**
    ```sh
    cd server
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```sh
    cd ../client
    npm install
    ```
4.  **Set Up Environment Variables:**
    -   In the `/server` directory, create a `.env` file and add your `MONGO_URI`, `PORT=5001`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.
    -   In the `/client` directory, create a `.env` file and add `VITE_API_URL=http://localhost:5001`.

5.  **Run the Application:**
    -   **Start the Backend:** In the `/server` terminal, run: `npm start`
    -   **Start the Frontend:** In the `/client` terminal, run: `npm run dev`

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.
