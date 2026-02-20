import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children, title }) {
  const { user, logout, ROLES } = useAuth();

  const roleLabel =
    user?.role === ROLES.FACULTY
      ? 'Faculty'
      : user?.role === ROLES.HOD
      ? 'HOD'
      : 'Student';

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-brand">
          <span className="layout-logo">◉</span>
          <h1>{title || 'Class Performance Dashboard'}</h1>
        </div>
        <div className="layout-user">
          <span className="layout-role">{roleLabel}</span>
          {user?.name && <span className="layout-name">{user.name}</span>}
          <button type="button" className="layout-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}
