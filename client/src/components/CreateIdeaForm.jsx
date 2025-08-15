// client/src/components/CreateIdeaForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

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
      setError("You must be logged in to post an idea.");
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
      const { data } = await axios.post('http://localhost:5001/api/ideas', newIdea, config);
      onIdeaAdded(data);
      setTitle('');
      setDescription('');
      setTags('');
      setDifficulty('Beginner');
    } catch (err) {
      setError("Failed to submit idea. Please try again.");
      console.error("Submit Idea Error:", err); // Log the real error to the console
    }
  };

  return (
    <div className="form-container">
      <h2>Submit a New Idea</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* ... Your form-group divs for inputs, textarea, select ... */}
         <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
        </div>
          <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Submit Idea</button>
      </form>
    </div>
  );
};

export default CreateIdeaForm;