import React from 'react';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ResultsProvider } from './context/ResultsContext';
import Login from './components/Login';
import FacultyDashboard from './components/FacultyDashboard';
import HODDashboard from './components/HODDashboard';
import StudentDashboard from './components/StudentDashboard';
import './App.css';

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Login />;

  switch (user.role) {
    case ROLES.FACULTY:
      return <FacultyDashboard />;
    case ROLES.HOD:
      return <HODDashboard />;
    case ROLES.STUDENT:
      return <StudentDashboard />;
    default:
      return <Login />;
  }
}

function App() {
  return (
    <AuthProvider>
      <ResultsProvider>
        <DashboardRouter />
      </ResultsProvider>
    </AuthProvider>
  );
}

export default App;
