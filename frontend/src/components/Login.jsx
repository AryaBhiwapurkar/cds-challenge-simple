import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css';

export default function Login({ onLogin , onSwitchToRegister}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      onLogin && onLogin(cred.user);
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
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>New user? <span className="auth-switch-link" onClick={onSwitchToRegister}>Register here</span></p>
      </div>
    </div>
  );
}