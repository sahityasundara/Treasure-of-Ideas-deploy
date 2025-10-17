// client/src/pages/BookmarksPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW: Add expanded card state for fullscreen card view ---
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Fetch bookmarked ideas on mount
  useEffect(() => {
    if (userInfo?.token) {
      const fetchBookmarks = async () => {
        setLoading(true);
        setError('');
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/ideas/mybookmarks`,
            config
          );
          if (Array.isArray(data)) {
            setBookmarks(data);
          } else {
            setBookmarks([]);
          }
        } catch (err) {
          console.error('Fetch Bookmarks Error:', err);
          setError('Failed to fetch bookmarks.');
          setBookmarks([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [userInfo?.token]);

  // Handle removing a bookmark
  const handleRemoveBookmark = async (idToRemove) => {
    if (!userInfo?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idToRemove}/bookmark`,
        null,
        config
      );
      setBookmarks((prev) => prev.filter((b) => b._id !== idToRemove));
    } catch (err) {
      console.error('Remove Bookmark Error:', err);
      setError('Failed to remove bookmark. Please try again.');
    }
  };

  // --- Clean conditional render logic ---
  const renderContent = () => {
    if (loading) {
      return <p style={{ textAlign: 'center' }}>Loading your bookmarks...</p>;
    }

    if (error) {
      return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }

    if (bookmarks.length === 0) {
      return (
        <p style={{ textAlign: 'center' }}>
          You haven't bookmarked any ideas yet. Go find some!
        </p>
      );
    }

    return (
      <div className="ideas-container">
        {bookmarks.map((idea) => (
          <IdeaCard
            key={idea._id}
            idea={idea}
            isExpanded={expandedCardId === idea._id}
            onExpand={setExpandedCardId}
            currentUser={userInfo}
            onBookmark={handleRemoveBookmark}
          />
        ))}
      </div>
    );
  };

  // --- If user isn't logged in ---
  if (!userInfo) {
    return (
      <div className="login-prompt">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your bookmarked ideas.</p>
        <Link to="/login" className="welcome-cta-button" style={{ fontSize: '1rem' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* --- Overlay for expanded card --- */}
      {expandedCardId && (
        <div className="overlay" onClick={() => setExpandedCardId(null)}></div>
      )}

      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>
        My Bookmarked Ideas
      </h1>

      {renderContent()}
    </div>
  );
};

export default BookmarksPage;
