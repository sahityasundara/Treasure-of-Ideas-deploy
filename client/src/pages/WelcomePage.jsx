// client/src/pages/WelcomePage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  // This effect tells the rest of the app that the welcome page is active
  useEffect(() => {
    document.body.classList.add('welcome-page-active');
    // Cleanup function to remove the class when we navigate away
    return () => {
      document.body.classList.remove('welcome-page-active');
    };
  }, []);

 
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          From Thought to <span className="title">Thing.</span>
        </h1>
        <p className="hero-subtitle">
          The collaborative platform where brilliant project ideas are born, shared and discovered.
          Stop wondering what to build next. Start here.
        </p>
        <Link to="/ideas" className="hero-cta-button">
          Explore Ideas Now
        </Link>
      </div>
    </div>
  );
};



export default WelcomePage;