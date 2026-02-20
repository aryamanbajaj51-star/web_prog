import React, { useState } from 'react';
import { useResults } from '../context/ResultsContext';
import { useAuth } from '../context/AuthContext';
import './ResultEditor.css';

export default function ResultEditor() {
  const { data, updateResult } = useResults();
  const { canEditResults } = useAuth();
  const [editing, setEditing] = useState(null);

  if (!canEditResults()) return null;

  const handleSave = (studentId, subjectId, value) => {
    const num = parseInt(value, 10);
    if (!Number.isNaN(num)) updateResult(studentId, subjectId, num);
    setEditing(null);
  };

  return (
    <div className="result-editor">
      <p className="result-editor-hint">Click a cell to edit marks (0–100). Only faculty can alter results.</p>
      <div className="result-editor-table-wrap">
        <table className="result-editor-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              {data.subjects.map((s) => (
                <th key={s.id}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.students.map((stu) => (
              <tr key={stu.id}>
                <td>{stu.name}</td>
                <td>{stu.rollNo}</td>
                {data.subjects.map((sub) => {
                  const key = `${stu.id}-${sub.id}`;
                  const isEditing = editing === key;
                  const val = stu.results[sub.id];
                  return (
                    <td key={sub.id}>
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={val}
                          autoFocus
                          onBlur={(e) => handleSave(stu.id, sub.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave(stu.id, sub.id, e.target.value);
                            if (e.key === 'Escape') setEditing(null);
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          className="result-editor-cell"
                          onClick={() => setEditing(key)}
                        >
                          {val}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
