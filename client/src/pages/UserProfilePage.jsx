// client/src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Hook to get the userId from the URL
import IdeaCard from '../components/IdeaCard';

const UserProfilePage = () => {
  const [userIdeas, setUserIdeas] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userId } = useParams(); // Get the user's ID from the route parameter
  const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchUserIdeas = async () => {
      if (!userId) return; // Don't fetch if there's no ID
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas/user/${userId}`);
        setUserIdeas(data);
        // Set the user's name from the first idea, if it exists
        if (data.length > 0) {
          setUserName(data[0].user.name);
        }
      } catch (err) {
        setError('Failed to fetch ideas for this user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserIdeas();
  }, [userId]);

  if (loading) return <p style={{ textAlign: 'center', color: '#d4c709ff' }}>Loading user's ideas...</p>;

  return (
    <div>
      {/* Show a clear title for the page */}
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>
        Ideas Submitted by {userName || 'User'}
      </h1>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <div className="ideas-container">
        {userIdeas.length > 0 ? (
          userIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              currentUser={currentUserInfo}
              // We can disable bookmark/delete on this page, or enable them
              // onBookmark={() => {}} 
              // onDelete={() => {}}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>This user hasn't submitted any ideas yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;