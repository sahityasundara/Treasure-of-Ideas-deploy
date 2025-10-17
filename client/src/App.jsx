// client/src/App.jsx - FINAL CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Import all pages and components
import WelcomePage from './pages/WelcomePage';
import IdeasPage from './pages/IdeasPage';
import ShareIdeaPage from './pages/ShareIdeaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookmarksPage from './pages/BookmarksPage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import MyIdeasPage from './pages/MyIdeasPage'; // <-- 1. ADD THE CORRECT IMPORT
import PrivateRoute from './components/PrivateRoute';
import { useScrollPosition } from './hooks/useScrollPosition';
import UserProfilePage from './pages/UserProfilePage';
import './App.css';

// You can keep this placeholder for now as it's not causing a conflict


// LogoutButton helper component
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

// Main router component
const AppRouter = () => {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const onWelcomePage = location.pathname === '/';
  const headerClass = onWelcomePage && scrollPosition < 50 ? 'main-header transparent' : 'main-header';
  const mainContentClass = onWelcomePage ? 'main-content welcome' : 'main-content';

  return (
    <div className="App">
      <header className={headerClass}>
      <Link to="/" className="logo-link"><h1>Treasure of Ideas</h1></Link>
        <nav className="main-nav">
          <Link to="/ideas" className="nav-link">View Ideas</Link>
          
          {userInfo ? (
            <>
              <Link to="/share" className="nav-link">Share Idea</Link>
              <Link to="/generate-idea" className="nav-link">AI Generator</Link>
              <Link to="/my-ideas" className="nav-link">My Ideas</Link>
              <Link to="/bookmarks" className="nav-link">My Bookmarks</Link>
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

      <main className={mainContentClass}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

          {/* All Protected Routes */}
          <Route path="/share" element={<PrivateRoute><ShareIdeaPage /></PrivateRoute>} />
          <Route path="/generate-idea" element={<PrivateRoute><AIGeneratorPage /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><BookmarksPage /></PrivateRoute>} />
          <Route path="/my-ideas" element={<PrivateRoute><MyIdeasPage /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

// The main App component that provides the Router context
function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;