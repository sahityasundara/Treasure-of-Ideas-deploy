import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          From Thought to <span className="hero-highlight">Thing.</span>
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