import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect if already logged in
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
     // CORRECT - uses backticks
const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/users/login`, // <-- FIXED
  { email, password },
  config
);

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />} {/* Show spinner when loading */}
      <div className="form-container">
        <h2>Welcome Back!</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          New to IdeaHub? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
