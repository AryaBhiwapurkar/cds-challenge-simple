import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css';

export default function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Registration successful! Please login.');
      setEmail('');
      setPassword('');
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handle}>
        <div className="input-group">
          <input 
            type="email"
            placeholder="Email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        
        <div className="input-group">
          <input 
            type="password"
            placeholder="Password"
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Already have an account? <span className="auth-switch-link" onClick={onSwitchToLogin}>Login here</span></p>
      </div>
    </div>
  );
}