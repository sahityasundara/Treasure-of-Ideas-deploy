import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import axios from 'axios';
import './CreateIdeaForm.css'; // ✅ Your styles are imported

// 2. Accept the new `initialData` prop. Default it to null if not provided.
const CreateIdeaForm = ({ onIdeaAdded, initialData = null }) => {
  
  // 3. Use the initialData to set the default state, or use empty strings.
  //    This is the core logic for the pre-fill feature.
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Beginner');
  const [category, setCategory] = useState(initialData?.category || 'Software');
  const [error, setError] = useState('');

  // 4. (Optional but good UX) Add a useEffect to update the form if the user generates a new idea
  //    while already on the page (this is an advanced case, but good practice).
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
      onIdeaAdded(data); // This function (from ShareIdeaPage) will navigate the user away
      
      // Clearing the form is still good practice
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
          {initialData ? 'Review and submit your AI-generated idea!' : 'Inspire others with your creativity!'}
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