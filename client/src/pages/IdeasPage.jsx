import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // State for Filters & Search
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // State for the Expanding Card Animation
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // This effect debounces the search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay after user stops typing
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // This effect fetches data from the API whenever a filter, search, or page changes
  useEffect(() => {
    const fetchIdeas = async (isNewSearch) => {
      if (isNewSearch) {
        setLoading(true); // Show the main loader for a new search
      } else {
        setLoadingMore(true); // Show the button loader for "Load More"
      }
      setError('');

      try {
        const params = new URLSearchParams();
        if (filterCategory !== 'All') {
          params.append('category', filterCategory);
        }
        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm);
        }
        params.append('page', page);

       // This is the CORRECT line
const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas?${params.toString()}`);

        if (data && Array.isArray(data.ideas)) {
          // If it's a new search (page 1), replace all ideas. Otherwise, append the new ones.
          setIdeas(prevIdeas => isNewSearch ? data.ideas : [...prevIdeas, ...data.ideas]);
          setTotalPages(data.pages);
        } else {
          setIdeas([]);
        }
      } catch (err) {
        setError('Failed to fetch ideas.');
        setIdeas([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    fetchIdeas(page === 1); // Pass true if it's the first page load for this filter set
  }, [filterCategory, debouncedSearchTerm, page]);

  // This effect resets the page to 1 whenever a filter or search term changes
  useEffect(() => {
    setPage(1);
  }, [filterCategory, debouncedSearchTerm]);

  // Handler for the "Load More" button
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Handler for bookmarking an idea
  const handleBookmark = async (idToBookmark) => {
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: updatedIdea } = await axios.put(`${import.meta.env.VITE_API_URL}/api/ideas/${idToBookmark}/bookmark`, null, config);
      setIdeas(ideas.map(idea => idea._id === updatedIdea._id ? updatedIdea : idea));
    } catch (err) {
      setError('Failed to update bookmark.');
    }
  };

  // Handler for deleting an idea
  const handleDelete = async (idToDelete) => {
    // Optional: Add a confirmation dialog for a better UX
    if (window.confirm("Are you sure you want to permanently delete this idea?")) {
      if (!userInfo) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`, config);
        setIdeas(ideas.filter((idea) => idea._id !== idToDelete));
        setExpandedCardId(null); // Close the card if it was expanded
      } catch (err) {
        setError('Failed to delete idea.');
      }
    }
  };

  return (
    <>
      {/* The dark overlay that appears behind the expanded card */}
      {expandedCardId && <div className="overlay" onClick={() => setExpandedCardId(null)}></div>}
      
      <div className="controls-container">
        <div className="search-bar">
          <input
  type="text"
  placeholder="Search ideas by keyword..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ fontWeight: "bold" }} 
/>
        </div>
        <div className="filter-container">
          <button className={`filter-btn ${filterCategory === 'All' ? 'active' : ''}`} onClick={() => setFilterCategory('All')}>All</button>
          <button className={`filter-btn ${filterCategory === 'Software' ? 'active' : ''}`} onClick={() => setFilterCategory('Software')}>Software</button>
          <button className={`filter-btn ${filterCategory === 'Hardware' ? 'active' : ''}`} onClick={() => setFilterCategory('Hardware')}>Hardware</button>
          <button className={`filter-btn ${filterCategory === 'Both' ? 'active' : ''}`} onClick={() => setFilterCategory('Both')}>Both</button>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
        {filterCategory} Ideas {debouncedSearchTerm && `matching "${debouncedSearchTerm}"`}
      </h2>
      
      {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</p>}
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading ideas...</p>
      ) : (
        <>
          <div className="ideas-container">
            {ideas.length > 0 ? (
              ideas.map((idea) => (
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
              <p style={{ textAlign: 'center' }}>No ideas found. Try a different search or filter!</p>
            )}
          </div>
          
          <div className="load-more-container">
            {page < totalPages && (
              <button onClick={handleLoadMore} className="load-more-btn" disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More Ideas'}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default IdeasPage;