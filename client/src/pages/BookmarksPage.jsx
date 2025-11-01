// client/src/pages/BookmarksPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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
          setBookmarks(Array.isArray(data) ? data : []);
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

  const renderContent = () => {
    if (loading) return <p style={{ textAlign: 'center' , color: '#d4c709ff'}}>Loading your bookmarks...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    if (bookmarks.length === 0) {
      return (
        <div className="no-ideas-container">
          <p>You haven't bookmarked any ideas yet.</p>
          <Link to="/ideas" className="share-link">
            Browse Ideas
          </Link>
        </div>
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
      {expandedCardId && (
        <div className="overlay" onClick={() => setExpandedCardId(null)}></div>
      )}

      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Bookmarked Ideas</h1>
      {renderContent()}
    </div>
  );
};

export default BookmarksPage;
