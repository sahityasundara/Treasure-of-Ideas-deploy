# Treasure of Ideas - A Full-Stack Project Sharing Platform

Welcome to Treasure of Ideas, a dynamic and collaborative web application designed for students, developers, and creators to share, discover, and manage project ideas. Built with the MERN stack, this platform provides a seamless and feature-rich experience from idea submission to discovery and collaboration.

**Live Demo URL:** [**https://treasure-of-ideas.netlify.app/**](https://treasure-of-ideas.netlify.app/)  

![Treasure of Ideas Screenshot](https://github.com/sahityasundara/Treasure-of-Ideas-deploy/raw/main/assets/TreasureofIdeasScreenshot.png)
*(The main ideas page showing the responsive card layout, search, and filtering capabilities.)*

---

## 🌟 Key Features

This project is a comprehensive full-stack application that showcases a wide range of modern web development skills and best practices.

**User & Authentication:**
- **Secure User Authentication:** Full user registration and login system using JSON Web Tokens (JWT) for secure, stateless sessions.
- **Password Hashing:** Passwords are never stored as plain text, using `bcryptjs` for robust hashing on the backend.

**Core Idea Management:**
- **Create & Share Ideas:** Logged-in users can share their project ideas through a dedicated, protected route, specifying title, description, tags, difficulty, and category (Software, Hardware, or Both).
- **View & Discover Ideas:** A beautifully designed, responsive grid layout displays all project ideas.
- **Delete Functionality:** Users can only delete their own submitted ideas, enforced by backend authorization.

**Advanced Interactive Features:**
- **Dynamic Filtering:** Filter ideas in real-time by category (Software, Hardware, Both) without a page reload.
- **Powerful Search:** A **debounced** search bar provides instant, case-insensitive search results across idea titles and descriptions, preventing excessive API calls and improving performance.
- **Pagination:** Implemented a "Load More" pagination system to ensure fast initial load times and high performance, even with a large number of ideas.
- **Bookmarking System:** Users can bookmark their favorite ideas. Bookmarked ideas are saved to a dedicated, protected "My Bookmarks" page for easy access and management.

**UI & UX:**
- **Modern & Responsive Design:** A clean, animated, and fully responsive user interface built with React and styled with pure CSS, utilizing CSS variables for a consistent theme.
- **Client-Side Routing:** A seamless multi-page application (SPA) experience using React Router, with a professional welcome page, ideas page, and protected user-specific pages.
- **Dynamic Navbar:** The navigation bar intelligently changes its content and style based on the user's login state and current page.

---

## 🛠️ Technology Stack & Skills Demonstrated

This project was built from the ground up, showcasing proficiency across the entire MERN stack and modern deployment workflows.

**Frontend:**
- **React.js:** For building a fast, component-based, and dynamic user interface.
- **React Router:** For client-side routing and creating a seamless SPA experience.
- **Axios:** For making asynchronous HTTP requests to the backend API.
- **Vite:** As the modern, high-performance build tool for the frontend.
- **CSS3:** For custom styling, animations, and a fully responsive design.

**Backend:**
- **Node.js & Express.js:** For building a fast, scalable, and robust RESTful API.
- **MongoDB Atlas:** As the cloud-hosted NoSQL database for storing user and idea data.
- **Mongoose:** As the Object Data Modeling (ODM) library for elegant and structured interaction with the MongoDB database.
- **JSON Web Tokens (JWT):** For implementing secure, stateless user authentication.
- **bcryptjs:** For hashing and securing user passwords.

**Deployment & DevOps:**
- **Dual-Platform Hosting:** A professional deployment strategy with the backend hosted on **Render** and the frontend on **Netlify**.
- **Continuous Integration/Continuous Deployment (CI/CD):** The project is connected to GitHub, enabling automatic redeployments on every `git push`.
- **Environment Variable Management:** Securely managed API keys, database URIs, and other secrets in a production environment.
- **Git & GitHub:** For version control and source code management.

---

## 🚀 How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or higher)
- npm
- A MongoDB Atlas connection string

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sahityasundara/Treasure-of-Ideas-deploy.git
   cd Treasure-of-Ideas-deploy
2. Install Backend Dependencies:
   ```sh
   cd server
   npm install
3. Install Frontend Dependencies:
   ```sh
   cd ../client
   npm install
4. Set Up Environment Variables:
   In the /server directory, create a .env file and add your MONGO_URI, PORT=5001, and JWT_SECRET.
   In the /client directory, create a .env file and add VITE_API_URL=http://localhost:5001.
5. Run the Application:
   Start the Backend: In the /server terminal, run: npm start
   Start the Frontend: In the /client terminal, run: npm run dev
Open http://localhost:5173 in your browser to view the application.
