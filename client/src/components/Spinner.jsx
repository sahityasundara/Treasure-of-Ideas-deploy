// client/src/components/Spinner.jsx
import React from 'react';
import './Spinner.css'; // We'll create this CSS file next

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container"></div>
    </div>
  );
};

export default Spinner;