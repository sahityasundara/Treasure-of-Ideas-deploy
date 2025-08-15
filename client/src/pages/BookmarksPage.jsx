import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchBookmarks = async () => {
      console.log("Fetching bookmarked ideas...");
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas/mybookmarks`, config);
        setBookmarks(data);
        console.log("Successfully fetched bookmarks:", data);
      } catch (err) {
        setError('Failed to fetch bookmarks.');
        console.error("Fetch Bookmarks Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) {
        fetchBookmarks();
    }
  }, [userInfo?.token]);

  // This function handles removing an item from the bookmark list
  const handleRemoveBookmark = async (idToRemove) => {
    console.log(`Attempting to remove bookmark with ID: ${idToRemove}`);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // The same toggle endpoint works for removing
      await axios.put(`${import.meta.env.VITE_API_URL}/api/ideas/${idToRemove}/bookmark`, null, config);
      
      console.log("API call successful. Filtering UI.");
      
      // Instantly remove the idea from the UI state for a great user experience
      const newBookmarks = bookmarks.filter(b => b._id !== idToRemove);
      setBookmarks(newBookmarks);

      console.log("New bookmarks state:", newBookmarks);

    } catch (err) {
      setError('Failed to remove bookmark. Please try again.');
      console.error("Remove Bookmark Error:", err);
    }
  };

  if (loading) return   <p className="loading-text">Loading your bookmarks...</p>

;

  return (
    <div className="page-container"> 
      <h1 className="page-title">My Bookmarked Ideas</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {bookmarks.length > 0 ? (
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
      ) : (
        <div className="empty-message-wrapper">
  <p className="empty-message">
    You haven't bookmarked any ideas yet. Go find some!
  </p>
</div>
      )}
    </div>
  );
};


export default BookmarksPage;