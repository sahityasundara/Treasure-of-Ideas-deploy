// client/src/pages/WelcomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-page-container">
      <div className="welcome-content">
        {/* We add a "brand" subtitle to introduce the project name */}
        <p className="welcome-brand">Welcome to</p>
        <h1 className="welcome-title">Treasure of Ideas</h1>
        <p className="welcome-subtitle">
          Join a community of innovators. Share your project concepts, discover new challenges, and bring your ideas to life with the help of AI.
        </p>
        <Link to="/ideas" className="welcome-cta-button">
          <i className="fas fa-rocket" style={{ marginRight: '8px' }}></i> Explore Ideas Now
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;