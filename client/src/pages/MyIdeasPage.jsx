import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';

const MyIdeasPage = () => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the current user's info directly from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMyIdeas = async () => {
      // Ensure we have user info and a token before making the call
      if (!userInfo || !userInfo.token) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Use the logged-in user's ID to fetch their ideas
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userInfo._id}/ideas`);
        setMyIdeas(data);
      } catch (err) {
        setError('Failed to fetch your ideas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyIdeas();
  }, [userInfo._id]); // Re-fetch if the user ID changes (e.g., on re-login)

  // Handlers for bookmarking and deleting are needed for the IdeaCard
  const handleBookmark = async (idToBookmark) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: updatedIdea } = await axios.put(`${import.meta.env.VITE_API_URL}/api/ideas/${idToBookmark}/bookmark`, null, config);
      setMyIdeas(myIdeas.map(idea => idea._id === updatedIdea._id ? updatedIdea : idea));
    } catch (err) { console.error('Bookmark error:', err); }
  };

  const handleDelete = async (idToDelete) => {
    if (window.confirm("Are you sure you want to permanently delete this idea?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`, config);
        setMyIdeas(myIdeas.filter((idea) => idea._id !== idToDelete));
      } catch (err) { console.error('Delete error:', err); }
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading your ideas...</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0 40px 0' }}>My Shared Ideas</h1>
      
      {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</p>}
      
      <div className="ideas-container">
        {myIdeas.length > 0 ? (
          myIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              currentUser={userInfo}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
              // You can add onExpand here if you want that feature on this page
            />
          ))
        ) : (
          !error && <p style={{ textAlign: 'center' }}>You haven't shared any ideas yet. Why not share one now?</p>
        )}
      </div>
    </div>
  );
};

export default MyIdeasPage;