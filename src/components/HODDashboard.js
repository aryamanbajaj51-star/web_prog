import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Layout from './Layout';
import { useResults } from '../context/ResultsContext';
import './Dashboard.css';

const STRONG_THRESHOLD = 75;
const WEAK_THRESHOLD = 60;

function getBarColor(avg) {
  if (avg >= STRONG_THRESHOLD) return '#5dd9a8';
  if (avg < WEAK_THRESHOLD) return '#f07178';
  return '#ffb347';
}

export default function HODDashboard() {
  const { getSubjectStats } = useResults();

  const subjectStats = useMemo(() => getSubjectStats(), [getSubjectStats]);

  const chartData = useMemo(
    () =>
      subjectStats.map((s) => ({
        name: s.name,
        avg: s.avg,
        passRate: s.passRate,
        min: s.min,
        max: s.max,
      })),
    [subjectStats]
  );

  const strongSubjects = useMemo(
    () => subjectStats.filter((s) => s.avg >= STRONG_THRESHOLD),
    [subjectStats]
  );
  const weakSubjects = useMemo(
    () => subjectStats.filter((s) => s.avg < WEAK_THRESHOLD),
    [subjectStats]
  );

  return (
    <Layout title="HOD — Subject strength & weakness">
      <div className="dashboard-section summary-cards">
        <div className="summary-card strong">
          <h3>Strong subjects (avg ≥ 75%)</h3>
          {strongSubjects.length ? (
            <ul>
              {strongSubjects.map((s) => (
                <li key={s.id}>
                  <strong>{s.name}</strong> — avg {s.avg}%, pass {s.passRate}%
                </li>
              ))}
            </ul>
          ) : (
            <p>None in this range.</p>
          )}
        </div>
        <div className="summary-card weak">
          <h3>Weak subjects (avg &lt; 60%)</h3>
          {weakSubjects.length ? (
            <ul>
              {weakSubjects.map((s) => (
                <li key={s.id}>
                  <strong>{s.name}</strong> — avg {s.avg}%, pass {s.passRate}%
                </li>
              ))}
            </ul>
          ) : (
            <p>None in this range.</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Subject-wise average (strength indicator)</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
                formatter={(value, name) => [value, name === 'avg' ? 'Average %' : 'Pass %']}
              />
              <Bar dataKey="avg" name="Average %" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.avg)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend-inline">
          <span className="legend-dot strong-dot" /> Strong (≥75%) &nbsp;
          <span className="legend-dot mid-dot" /> Average (60–75%) &nbsp;
          <span className="legend-dot weak-dot" /> Weak (&lt;60%)
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Subject summary table</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Avg</th>
                <th>Pass %</th>
                <th>Min</th>
                <th>Max</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.avg}</td>
                  <td>{s.passRate}%</td>
                  <td>{s.min}</td>
                  <td>{s.max}</td>
                  <td>
                    <span className={`status-badge ${s.avg >= STRONG_THRESHOLD ? 'strong' : s.avg < WEAK_THRESHOLD ? 'weak' : 'mid'}`}>
                      {s.avg >= STRONG_THRESHOLD ? 'Strong' : s.avg < WEAK_THRESHOLD ? 'Weak' : 'Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
