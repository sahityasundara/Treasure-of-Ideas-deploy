import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AIGeneratorPage = () => {
  const [keywords, setKeywords] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedIdea(null);
    try {
      // 1. Prepare the request
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const keywordsArray = keywords.split(',').map(k => k.trim());
      

        const apiUrl = `${import.meta.env.VITE_API_URL}/api/ai/generate-idea`;
  console.log("Attempting to call API at:", apiUrl);
      // 2. Make the API call to your backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-idea`,
        { keywords: keywordsArray },
        config
      );
      
      // 3. Set the state with the AI's response
      setGeneratedIdea(data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseThisIdea = () => {
    // 4. Navigate to the "Share Idea" page, passing the AI data in the state
    navigate('/share', { state: { prefillData: generatedIdea } });
  };

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2 style={{ textAlign: 'center' }}>🤖 AI Project Idea Generator</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted-color)' }}>
        Enter a few keywords (comma-separated) and let our AI create a unique project idea for you!
      </p>

      <form onSubmit={handleGenerate} style={{ marginTop: '30px' }}>
        <div className="form-group">
          <label htmlFor="keywords">Keywords</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. Python, Beginner, Game"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Generating...' : (
            <>
              <i className="fas fa-magic"></i> Generate Idea
            </>
          )}
        </button>
      </form>

      {error && <p style={{ color: 'var(--danger-color)', marginTop: '20px', textAlign: 'center' }}>{error}</p>}

      {/* This block will only appear after a successful generation */}
      {generatedIdea && (
        <div className="ai-result-card">
          <h3>{generatedIdea.title}</h3>
          <p>{generatedIdea.description}</p>
          <div className="idea-card-tags">
            <span className={`tag category-tag category-${generatedIdea.category?.toLowerCase()}`}>{generatedIdea.category}</span>
            {generatedIdea.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
          </div>
          <p><strong>Difficulty:</strong> {generatedIdea.difficulty}</p>
          <button onClick={handleUseThisIdea} className="submit-btn" style={{ marginTop: '20px' }}>
            <i className="fas fa-pencil-alt"></i> Use This Idea
          </button>
        </div>
      )}
    </div>
  );
};

export default AIGeneratorPage;