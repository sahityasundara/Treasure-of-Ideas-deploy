// client/src/App.jsx - FINAL VERSION WITH TRANSPARENT NAVBAR
import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Import all your pages and components
import WelcomePage from './pages/WelcomePage';
import IdeasPage from './pages/IdeasPage';
import ShareIdeaPage from './pages/ShareIdeaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookmarksPage from './pages/BookmarksPage';
import PrivateRoute from './components/PrivateRoute';
import { useScrollPosition } from './hooks/useScrollPosition'; // Make sure this file exists
import UserProfilePage from './pages/UserProfilePage';
import MyIdeasPage from './pages/MyIdeasPage';
import './App.css';

// 2. Define the helper component outside the main App component
const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('userInfo');
      navigate('/login');
      window.location.reload();
    }
  };
  return <a href="#!" onClick={handleLogout} className="nav-link">Logout</a>;
};

// This is the main router component for the entire application
const AppRouter = () => {
  const [userInfo, setUserInfo] = useState(null);
  
  // 3. These hooks get the current URL path and scroll position
  const location = useLocation();
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // 4. This is the logic to determine the header's class
  const onWelcomePage = location.pathname === '/';
  const headerClass = onWelcomePage && scrollPosition < 50
    ? 'main-header transparent'
    : 'main-header';

  return (
    <div className="App">
      {/* 5. Apply the dynamic headerClass here */}
      <header className={headerClass}>
        <Link to="/" className="logo"><h1>Treasure of Ideas</h1></Link>
        <nav className="main-nav">
          <Link to="/ideas" className="nav-link">View Ideas</Link>
          {userInfo ? (
            <>
              <Link to="/share" className="nav-link">Share Idea</Link>
              <Link to="/my-ideas" className="nav-link">My Ideas</Link>
              <Link to="/bookmarks" className="nav-link">My Bookmarks</Link>

              {/* ✅ Added AI Generator nav link */}
            

              <span className="user-name">Hello, {userInfo.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-button">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share" element={<PrivateRoute><ShareIdeaPage /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><BookmarksPage /></PrivateRoute>} />
          <Route path="/my-ideas" element={<PrivateRoute><MyIdeasPage /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />

          {/* ✅ Added AI Generator route */}
         c
        </Routes>
      </main>
    </div>
  );
};

// The main App component now wraps the router to provide the Router context
function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
