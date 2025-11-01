// client/src/pages/MyIdeasPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';
import { Link } from 'react-router-dom';

const MyIdeasPage = () => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMyIdeas = async () => {
      setLoading(true);
      setError('');
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ideas/myideas`,
          config
        );
        if (Array.isArray(data)) setMyIdeas(data);
        else setMyIdeas([]);
      } catch (err) {
        console.error('Fetch MyIdeas Error:', err);
        setError('Failed to fetch your ideas.');
        setMyIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchMyIdeas();
    else setLoading(false);
  }, [userInfo?.token]);

  const handleBookmark = async (idToBookmark) => {
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: updatedIdea } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idToBookmark}/bookmark`,
        null,
        config
      );
      setMyIdeas((prev) =>
        prev.map((idea) => (idea._id === updatedIdea._id ? updatedIdea : idea))
      );
    } catch (err) {
      console.error('Bookmark Error:', err);
      setError('Failed to update bookmark.');
    }
  };

  const handleDelete = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to permanently delete this idea?')) return;
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`, config);
      setMyIdeas((prev) => prev.filter((idea) => idea._id !== idToDelete));
      setExpandedCardId(null);
    } catch (err) {
      console.error('Delete Error:', err);
      setError('Failed to delete idea.');
    }
  };

  if (!userInfo) {
    return (
      <div className="login-prompt">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your submitted ideas.</p>
        <Link to="/login" className="welcome-cta-button" style={{ fontSize: '1rem' }}>
          Go to Login
        </Link>
      </div>
    );
  }

 if (loading) return <p style={{ textAlign: 'center', color: '#d4c709ff'
}}>Loading your ideas...</p>;

  return (
    <div>
      {expandedCardId && (
        <div className="overlay" onClick={() => setExpandedCardId(null)}></div>
      )}

      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Submitted Ideas</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {myIdeas.length > 0 ? (
        <div className="ideas-container">
          {myIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              isExpanded={expandedCardId === idea._id}
              onExpand={setExpandedCardId}
              currentUser={userInfo}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="no-ideas-container">
          <p>You haven't shared any ideas yet.</p>
          <Link to="/share" className="share-link">
            Why not share one now?
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyIdeasPage;
