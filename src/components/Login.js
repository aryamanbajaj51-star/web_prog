import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, ROLES } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES.FACULTY);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, name.trim() || undefined);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Class Performance Dashboard</h1>
        <p className="login-subtitle">Select your role to continue</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Name (optional)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            <span>Role</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value={ROLES.FACULTY}>Faculty — Analyze & edit results</option>
              <option value={ROLES.HOD}>HOD — Subject strength / weakness</option>
              <option value={ROLES.STUDENT}>Student — View results only</option>
            </select>
          </label>
          <button type="submit">Enter Dashboard</button>
        </form>
      </div>
    </div>
  );
}
