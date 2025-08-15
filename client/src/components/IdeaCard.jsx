import { Link } from 'react-router-dom';

const IdeaCard = ({ idea, isExpanded, onExpand, currentUser, onBookmark, onDelete }) => {
  const isOwner = currentUser && idea.user?._id === currentUser._id;
  const isBookmarked = currentUser && idea.bookmarkedBy.includes(currentUser._id);

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };
  
  const handleCardClick = () => {
       if (typeof onExpand === 'function' && !isExpanded) {
        onExpand(idea._id);
    }
  };

  // 2. ADD a helper function to stop link clicks from expanding the card
  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`idea-card ${isExpanded ? 'expanded' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-actions">
        {currentUser && onBookmark && (
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => handleActionClick(e, () => onBookmark(idea._id))}
            title={isBookmarked ? 'Remove' : 'Bookmark'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
        {onDelete && isOwner && (
          <button
            className="delete-btn"
            onClick={(e) => handleActionClick(e, () => onDelete(idea._id))}
            title="Delete"
          >
            &times;
          </button>
        )}
      </div>

      {/* --- SUMMARY VIEW --- */}
      <div className="card-summary-view">
        <h3>{idea.title}</h3>
        <p className="idea-card-description">{idea.description.substring(0, 100)}...</p>
        <div className="idea-card-tags">
          <span className={`tag category-tag category-${idea.category?.toLowerCase()}`}>{idea.category}</span>
        </div>
        {/* We add a footer to the summary view for consistency */}
        <div className="card-footer">
            <span className="idea-card-difficulty">{idea.difficulty}</span>
            {/* 3. UPDATE the author span to be a Link */}
            <span className="idea-author">
                by <Link to={`/profile/${idea.user?._id}`} onClick={handleLinkClick}>{idea.user?.name || 'Anonymous'}</Link>
            </span>
        </div>
      </div>
      
      {/* --- DETAILED VIEW --- */}
      <div className="card-detail-view">
        <h2 style={{color: 'var(--primary-color)'}}>{idea.title}</h2>
        <div className="idea-card-tags">
          <span className={`tag category-tag category-${idea.category?.toLowerCase()}`}>{idea.category}</span>
          {idea.tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)}
        </div>
        <p className="detail-description">{idea.description}</p>
        <div className="detail-footer">
          {/* 4. UPDATE the author span to be a Link here as well */}
          <span><strong>Author:</strong> 
            <Link to={`/profile/${idea.user?._id}`} onClick={handleLinkClick}>{idea.user?.name || 'Anonymous'}</Link>
          </span>
          <span><strong>Difficulty:</strong> {idea.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;