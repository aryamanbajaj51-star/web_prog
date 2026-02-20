import React, { createContext, useContext, useState, useCallback } from 'react';
import initialData from '../data/results.json';

const ResultsContext = createContext(null);

export function ResultsProvider({ children }) {
  const [data, setData] = useState(initialData);

  const updateResult = useCallback((studentId, subjectId, marks) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const student = next.students.find((s) => s.id === studentId);
      if (student && student.results[subjectId] !== undefined) {
        student.results[subjectId] = Math.min(100, Math.max(0, Number(marks)));
      }
      return next;
    });
  });

  const getSubjectStats = useCallback(() => {
    const { subjects, students } = data;
    return subjects.map((sub) => {
      const vals = students.map((s) => s.results[sub.id]).filter((n) => n != null);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      const passCount = vals.filter((v) => v >= 40).length;
      return {
        id: sub.id,
        name: sub.name,
        avg: Math.round(avg * 10) / 10,
        passRate: Math.round((passCount / vals.length) * 100) || 0,
        min: vals.length ? Math.min(...vals) : 0,
        max: vals.length ? Math.max(...vals) : 0,
      };
    });
  }, [data]);

  return (
    <ResultsContext.Provider
      value={{
        data,
        updateResult,
        getSubjectStats,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error('useResults must be used within ResultsProvider');
  return ctx;
}
