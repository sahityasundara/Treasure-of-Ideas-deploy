// client/src/components/CreateIdeaForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateIdeaForm.css'; // ✅ Import the new styles

const CreateIdeaForm = ({ onIdeaAdded, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Beginner');
  const [category, setCategory] = useState(initialData?.category || 'Software');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTags(initialData.tags?.join(', ') || '');
      setDifficulty(initialData.difficulty || 'Beginner');
      setCategory(initialData.category || 'Software');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // ... (rest of your handleSubmit logic is perfect and does not need to change)
  };

  return (
    <div className="create-idea-container">
      <form className="create-idea-form" onSubmit={handleSubmit}>
        {/* --- NEW, COOLER HEADER --- */}
        <h2>💡 Share Your Project Idea</h2>
        <p className="form-subtitle">
          {initialData 
            ? 'Review and submit your AI-generated masterpiece!' 
            : 'Inspire the community with your creativity. Fill out the details below to share your concept.'
          }
        </p>

        {error && <p className="error-text">{error}</p>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short, catchy title for your idea"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project in detail. What problem does it solve? What are the key features?"
          rows="5"
          required
        ></textarea>

        <label>Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., AI, Web App, Beginner"
          required
        />

        {/* --- NEW ROW LAYOUT FOR DROPDOWNS --- */}
        <div className="form-row">
          <div>
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : (
            <>
              <i className="fas fa-rocket"></i> Submit Idea
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateIdeaForm;