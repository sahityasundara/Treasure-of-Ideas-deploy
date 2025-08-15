// client/src/components/IdeaModal.jsx
import React from 'react';
import Modal from 'react-modal';

const IdeaModal = ({ idea, isOpen, onRequestClose }) => {
  if (!idea) return null; // Don't render if no idea is selected

  // Custom styles for the modal for a professional look
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh',
      padding: '2rem',
      borderRadius: 'var(--radius)',
      border: 'none',
      boxShadow: 'var(--shadow-lg)',
    },
    overlay: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)', // A dark, semi-transparent overlay
      backdropFilter: 'blur(3px)',
      zIndex: 1100,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Project Idea Details"
      closeTimeoutMS={200} // Smooth close animation
    >
      <div className="modal-content">
        {/* Close button inside the modal */}
        <button onClick={onRequestClose} className="modal-close-btn">&times;</button>
        
        <h2 className="modal-title">{idea.title}</h2>
        
        <div className="modal-meta">
          <span className={`tag category-tag category-${idea.category?.toLowerCase()}`}>
            {idea.category}
          </span>
          <span className="modal-author">by {idea.user?.name || 'Anonymous'}</span>
        </div>
        
        <p className="modal-description">{idea.description}</p>
        
        <div className="modal-footer">
          <div className="idea-card-tags">
            <strong>Tags:</strong> 
            {idea.tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)}
          </div>
          <div className="idea-card-difficulty">
            <strong>Difficulty:</strong> {idea.difficulty}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default IdeaModal;