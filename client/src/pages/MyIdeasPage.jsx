// client/src/pages/MyIdeasPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';
import { Link } from 'react-router-dom';

const MyIdeasPage = () => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW: Expanded card state ---
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // --- Fetch user's own ideas ---
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
        if (Array.isArray(data)) {
          setMyIdeas(data);
        } else {
          setMyIdeas([]);
        }
      } catch (err) {
        console.error('Fetch MyIdeas Error:', err);
        setError('Failed to fetch your ideas.');
        setMyIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchMyIdeas();
    } else {
      setLoading(false);
    }
  }, [userInfo?.token]);

  // --- Bookmark handler (optional) ---
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

  // --- Delete handler ---
  const handleDelete = async (idToDelete) => {
    if (
      window.confirm('Are you sure you want to permanently delete this idea?')
    ) {
      if (!userInfo) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`,
          config
        );
        // Remove from state and close expanded card if open
        setMyIdeas((prev) => prev.filter((idea) => idea._id !== idToDelete));
        setExpandedCardId(null);
      } catch (err) {
        console.error('Delete Error:', err);
        setError('Failed to delete idea.');
      }
    }
  };

  // --- If user not logged in ---
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

  // --- Loading state ---
  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading your ideas...</p>;
  }

  return (
    <div>
      {/* --- Overlay behind expanded card --- */}
      {expandedCardId && (
        <div className="overlay" onClick={() => setExpandedCardId(null)}></div>
      )}

      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Submitted Ideas</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div className="ideas-container">
        {myIdeas.length > 0 ? (
          myIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              isExpanded={expandedCardId === idea._id}
              onExpand={setExpandedCardId}
              currentUser={userInfo}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>
            You haven't shared any ideas yet.{' '}
            <Link to="/share">Why not share one now?</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default MyIdeasPage;
