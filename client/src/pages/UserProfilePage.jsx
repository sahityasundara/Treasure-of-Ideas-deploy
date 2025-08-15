import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';

const UserProfilePage = () => {
  const [userIdeas, setUserIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  // The useParams hook gets the dynamic part of the URL (e.g., the '60c72...')
  const { userId } = useParams();
  const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchUserIdeas = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}/ideas`);
        setUserIdeas(data);

        // If the user has posted ideas, get their name from the first idea.
        if (data.length > 0) {
          setUserName(data[0].user.name);
        } else {
          // If the user has no ideas, we can't get their name from this API call.
          // For a future enhancement, you could create a GET /api/users/:userId endpoint.
          // For now, we handle this gracefully.
          setUserName('this user'); // Set a generic name
        }
      } catch (err) {
        setError('Failed to fetch user profile. The user may not exist.');
        console.error("Fetch Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdeas();
  }, [userId]); // Re-fetch if the userId in the URL changes

  // We need to provide handlers for bookmarking and deleting on this page too.
  const handleBookmark = async (idToBookmark) => {
    if (!currentUserInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${currentUserInfo.token}` } };
      const { data: updatedIdea } = await axios.put(`${import.meta.env.VITE_API_URL}/api/ideas/${idToBookmark}/bookmark`, null, config);
      setUserIdeas(userIdeas.map(idea => idea._id === updatedIdea._id ? updatedIdea : idea));
    } catch (err) {
      console.error('Bookmark error on profile page:', err);
    }
  };

  const handleDelete = async (idToDelete) => {
    if (window.confirm("Are you sure you want to permanently delete this idea?")) {
      if (!currentUserInfo) return;
      try {
        const config = { headers: { Authorization: `Bearer ${currentUserInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`, config);
        setUserIdeas(userIdeas.filter((idea) => idea._id !== idToDelete));
      } catch (err) {
        console.error('Delete error on profile page:', err);
      }
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0 40px 0' }}>
        Ideas Shared by {userName}
      </h1>
      
      {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</p>}
      
      <div className="ideas-container">
        {userIdeas.length > 0 ? (
          userIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              currentUser={currentUserInfo}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
              // Note: We are not passing onExpand, so the card won't expand here.
              // This is a design choice to keep the profile page simpler.
            />
          ))
        ) : (
          // Show a helpful message if the user exists but has no ideas
          !error && <p style={{ textAlign: 'center' }}>This user hasn't shared any ideas yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;