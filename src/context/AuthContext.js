import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ROLES = { FACULTY: 'faculty', HOD: 'hod', STUDENT: 'student' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role, name = '') => {
    setUser({ role, name: name || role });
  };

  const logout = () => setUser(null);

  const canEditResults = () => user?.role === ROLES.FACULTY;
  const isFaculty = () => user?.role === ROLES.FACULTY;
  const isHOD = () => user?.role === ROLES.HOD;
  const isStudent = () => user?.role === ROLES.STUDENT;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        canEditResults,
        isFaculty,
        isHOD,
        isStudent,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLES };
