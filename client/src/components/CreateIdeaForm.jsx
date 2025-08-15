import React, { useState } from 'react';
import axios from 'axios';
import './CreateIdeaForm.css'; // ✅ Import styles

const CreateIdeaForm = ({ onIdeaAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Software');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in to post an idea.');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const newIdea = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      difficulty,
      category,
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ideas`,
        newIdea,
        config
      );
      onIdeaAdded(data);
      setTitle('');
      setDescription('');
      setTags('');
      setDifficulty('Beginner');
      setCategory('Software');
    } catch (err) {
      setError('Failed to submit idea. Please try again.');
      console.error('Submit Idea Error:', err);
    }
  };

  return (
    <div className="create-idea-container">
      <form className="create-idea-form" onSubmit={handleSubmit}>
        <h2>💡 Share Your Project Idea</h2>
        <p className="form-subtitle">
          Inspire others with your creativity! Fill out the details below to submit your idea.
        </p>

        {error && <p className="error-text">{error}</p>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short, catchy title"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project idea in detail..."
          required
        ></textarea>

        <label>Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., AI, Web Development, Blockchain"
          required
        />

        <div className="form-row">
          <div>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">🚀 Submit Idea</button>
      </form>
    </div>
  );
};

export default CreateIdeaForm;
