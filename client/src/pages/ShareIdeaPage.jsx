// client/src/pages/ShareIdeaPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateIdeaForm from '../components/CreateIdeaForm';

const ShareIdeaPage = () => {
  const navigate = useNavigate();

  // This function will be called by the form upon successful submission
  const handleIdeaAdded = (newIdea) => {
    // After the idea is created, navigate the user to the main ideas page
    // so they can see their new post.
    navigate('/ideas');
  };

  return (
    <div>
      {/* We pass the handleIdeaAdded function to the form */}
      <CreateIdeaForm onIdeaAdded={handleIdeaAdded} />
    </div>
  );
};

export default ShareIdeaPage;