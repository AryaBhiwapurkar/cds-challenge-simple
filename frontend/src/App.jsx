import React, { useEffect, useState, memo } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import './App.css';

const API = import.meta.env.VITE_API_BASE_URL;

// Memoize TaskList to prevent unnecessary re-renders when dropdown state changes
const MemoizedTaskList = memo(TaskList);

export default function App() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken(/* forceRefresh */ true);
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });
    return unsub;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.user-menu')) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function logout() {
    await signOut(auth);
    setUser(null);
    setDropdownOpen(false);
  }

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="app-title">Tasks App</h1>
            <p className="app-subtitle">Manage your tasks efficiently</p>
          </div>
          
          <div className="auth-forms">
            <div className="auth-section">
              <h2>{showLogin ? 'Login' : 'Register'}</h2>
              {showLogin ? (
                <Login onLogin={() => {}} onSwitchToRegister={switchToRegister} />
              ) : (
                <Register onSwitchToLogin={switchToLogin} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="main-app">
          {/* Beautiful Header with dropdown user menu */}
          <div className="app-header">
            <div className="header-content">
              <h1 className="app-title">Tasks App</h1>
              
              {/* New Dropdown User Menu */}
              <div className="user-menu">
                <button 
                  className="user-avatar" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getUserInitial()}
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-email-dropdown">
                      {user.email}
                    </div>
                    <button className="logout-btn-dropdown" onClick={logout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Task List Component - Now memoized to prevent unnecessary re-renders */}
          <div className="task-container">
            <MemoizedTaskList apiBase={API} idToken={idToken} />
          </div>
        </div>
      )}
    </div>
  );
}