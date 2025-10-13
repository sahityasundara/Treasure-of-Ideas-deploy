// client/src/pages/BookmarksPage.jsx - FINAL ROBUST VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (userInfo?.token) {
      const fetchBookmarks = async () => {
        setLoading(true);
        setError(''); // Clear previous errors
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas/mybookmarks`, config);
          if (Array.isArray(data)) {
            setBookmarks(data);
          } else {
            setBookmarks([]);
          }
        } catch (err) {
          setError('Failed to fetch bookmarks.');
          console.error("Fetch Bookmarks Error:", err);
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
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/ideas/${idToRemove}/bookmark`, null, config);
      setBookmarks(bookmarks.filter(b => b._id !== idToRemove));
    } catch (err) {
      setError('Failed to remove bookmark. Please try again.');
    }
  };
  
  // --- THIS IS THE NEW, CLEANER RENDER LOGIC ---
  const renderContent = () => {
    if (loading) {
      return <p style={{ textAlign: 'center' }}>Loading your bookmarks...</p>;
    }
    if (error) {
      return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }
    if (bookmarks.length === 0) {
      return <p style={{ textAlign: 'center' }}>You haven't bookmarked any ideas yet. Go find some!</p>;
    }
    return (
      <div className="ideas-container">
        {bookmarks.map((idea) => (
          <IdeaCard
            key={idea._id}
            idea={idea}
            currentUser={userInfo}
            onBookmark={handleRemoveBookmark}
          />
        ))}
      </div>
    );
  };

  // If the user isn't logged in, show a prompt
  if (!userInfo) {
    return (
      <div className="login-prompt">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your bookmarked ideas.</p>
        <Link to="/login" className="welcome-cta-button" style={{fontSize: '1rem'}}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div> 
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Bookmarked Ideas</h1>
      {renderContent()}
    </div>
  );
};

export default BookmarksPage;