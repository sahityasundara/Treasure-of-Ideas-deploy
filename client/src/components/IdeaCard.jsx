// client/src/components/IdeaCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const IdeaCard = ({ idea, isExpanded, onExpand, currentUser, onBookmark, onDelete }) => {
  const isOwner = currentUser && idea.user?._id === currentUser._id;
  const isBookmarked = currentUser && idea.bookmarkedBy.includes(currentUser._id);
  const bookmarkIcon = isBookmarked ? "fas fa-star" : "far fa-star";

  // Prevent card from expanding if a button was clicked
  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Stop the click from bubbling up
    action();
  };

  return (
    <div
      className={`idea-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => !isExpanded && onExpand && onExpand(idea._id)}
    >
      <div className="card-actions">
        {currentUser && onBookmark && (
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => handleActionClick(e, () => onBookmark(idea._id))}
            title="Bookmark"
          >
            <i className={bookmarkIcon}></i>
          </button>
        )}
        {onDelete && isOwner && (
          <button
            className="delete-btn"
            onClick={(e) => handleActionClick(e, () => onDelete(idea._id))}
            title="Delete Idea"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      <h3>{idea.title}</h3>
      <p className="idea-card-description">{idea.description}</p>

      <div className="idea-card-tags">
        {idea.category && (
          <span className={`tag category-tag category-${idea.category.toLowerCase()}`}>
            {idea.category}
          </span>
        )}
        {idea.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <div className="card-footer">
        <span className="idea-card-difficulty">{idea.difficulty}</span>
        {idea.user ? (
          <Link to={`/profile/${idea.user._id}`} className="idea-author-link">
            by {idea.user.name}
          </Link>
        ) : (
          <span className="idea-author">by Anonymous</span>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
