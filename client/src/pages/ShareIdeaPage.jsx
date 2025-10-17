// client/src/pages/ShareIdeaPage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreateIdeaForm from '../components/CreateIdeaForm';

const ShareIdeaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get pre-fill data from the AI Generator page, if it exists
  const prefillData = location.state?.prefillData || null;

  // This function is passed to the form, telling it where to go after a successful submission
  const handleIdeaAdded = () => {
    navigate('/ideas');
  };

  return (
    // The main container for the page
    <div>
      <CreateIdeaForm onIdeaAdded={handleIdeaAdded} initialData={prefillData} />
    </div>
  );
};

export default ShareIdeaPage;