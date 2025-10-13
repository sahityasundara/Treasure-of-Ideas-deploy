// client/src/pages/ShareIdeaPage.jsx
import React from 'react';
import CreateIdeaForm from '../components/CreateIdeaForm';
import { useNavigate, useLocation } from 'react-router-dom'; 

const ShareIdeaPage = () => {
  const navigate = useNavigate();
    const location = useLocation();
  // This function will be called by the form upon successful submission
   const prefillData = location.state?.prefillData || null;

  const handleIdeaAdded = (newIdea) => {
    navigate('/ideas');
  };

  return (
    <div>
      {/* 4. Pass the data down to the form component */}
      <CreateIdeaForm onIdeaAdded={handleIdeaAdded} initialData={prefillData} />
    </div>
  );
};

export default ShareIdeaPage;