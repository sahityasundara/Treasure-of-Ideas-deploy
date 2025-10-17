// client/src/pages/IdeasPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters & Search
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Card expansion
  const [expandedCardId, setExpandedCardId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch ideas
  useEffect(() => {
    const fetchIdeas = async (isNewSearch) => {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (filterCategory !== 'All') params.append('category', filterCategory);
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        params.append('page', page);

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ideas?${params.toString()}`
        );

        if (data && Array.isArray(data.ideas)) {
          setIdeas(isNewSearch ? data.ideas : [...ideas, ...data.ideas]);
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

    fetchIdeas(page === 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, debouncedSearchTerm, page]);

  // Reset page when filters/search change
  useEffect(() => setPage(1), [filterCategory, debouncedSearchTerm]);

  // Load more handler
  const handleLoadMore = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  // Bookmark toggle
  const handleBookmark = async (idToBookmark) => {
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: updatedIdea } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idToBookmark}/bookmark`,
        null,
        config
      );
      setIdeas(prev => prev.map(idea => (idea._id === updatedIdea._id ? updatedIdea : idea)));
    } catch {
      setError('Failed to update bookmark.');
    }
  };

  // Delete handler
  const handleDelete = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to permanently delete this idea?')) return;
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ideas/${idToDelete}`, config);
      setIdeas(prev => prev.filter(idea => idea._id !== idToDelete));
      setExpandedCardId(null);
    } catch {
      setError('Failed to delete idea.');
    }
  };

  // Generate page title
  const getPageTitle = () => {
    let title = '';
    switch (filterCategory) {
      case 'Software':
        title = 'Software Project Ideas';
        break;
      case 'Hardware':
        title = 'Hardware Project Ideas';
        break;
      case 'Both':
        title = 'Hybrid Project Ideas';
        break;
      default:
        title = 'All Project Ideas';
    }
    if (debouncedSearchTerm) title += ` matching "${debouncedSearchTerm}"`;
    return title;
  };

  return (
    <>
      {expandedCardId && <div className="overlay" onClick={() => setExpandedCardId(null)}></div>}

      <div className="controls-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search ideas by keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ fontWeight: 'bold' }}
          />
        </div>
        <div className="filter-container">
          <button
            className={`filter-btn ${filterCategory === 'All' ? 'active' : ''}`}
            onClick={() => setFilterCategory('All')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterCategory === 'Software' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Software')}
          >
            Software
          </button>
          <button
            className={`filter-btn ${filterCategory === 'Hardware' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Hardware')}
          >
            Hardware
          </button>
          <button
            className={`filter-btn ${filterCategory === 'Both' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Both')}
          >
            Hybrid
          </button>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
        {getPageTitle()}
      </h2>

      {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</p>}

      {loading ? (
        <p className="loading-text" style={{ textAlign: 'center' }}>Loading ideas...</p>
      ) : (
        <>
          <div className="ideas-container">
            {ideas.length > 0 ? (
              ideas.map(idea => (
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
              <button
                onClick={handleLoadMore}
                className="load-more-btn"
                disabled={loadingMore}
              >
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
