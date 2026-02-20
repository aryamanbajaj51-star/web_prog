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
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import Layout from './Layout';
import { useResults } from '../context/ResultsContext';
import './Dashboard.css';

const COLORS = ['#6d8cff', '#5dd9a8', '#ffb347', '#f07178', '#c792ea'];

export default function StudentDashboard() {
  const { data } = useResults();

  const subjectAvgChart = useMemo(() => {
    const { subjects, students } = data;
    return subjects.map((sub) => {
      const vals = students.map((s) => s.results[sub.id]).filter((n) => n != null);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return {
        name: sub.name,
        avg: Math.round(avg * 10) / 10,
      };
    });
  }, [data]);

  const distribution = useMemo(() => {
    const ranges = [
      { name: '90–100', min: 90, max: 100, count: 0 },
      { name: '80–89', min: 80, max: 89, count: 0 },
      { name: '70–79', min: 70, max: 79, count: 0 },
      { name: '60–69', min: 60, max: 69, count: 0 },
      { name: '50–59', min: 50, max: 59, count: 0 },
      { name: 'Below 50', min: 0, max: 49, count: 0 },
    ];
    data.students.forEach((s) => {
      const vals = Object.values(s.results);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      const r = ranges.find((r) => avg >= r.min && avg <= r.max);
      if (r) r.count += 1;
    });
    return ranges.filter((r) => r.count > 0);
  }, [data]);

  const studentWiseAvg = useMemo(() => {
    return data.students.map((s) => {
      const vals = Object.values(s.results);
      const avg =
        vals.length > 0
          ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
          : 0;
      return { name: s.name, avg, rollNo: s.rollNo };
    });
  }, [data]);

  return (
    <Layout title="Student — View results (read only)">
      <p className="dashboard-notice">
        You are viewing results only. Only faculty can alter results.
      </p>

      <div className="dashboard-section">
        <h2>Class performance distribution (by average)</h2>
        <div className="chart-wrap chart-wrap-pie">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, count }) => `${name}: ${count}`}
              >
                {distribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Subject-wise class average</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectAvgChart} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="avg" name="Class avg %" fill="#6d8cff" radius={[4, 4, 0, 0]}>
                {subjectAvgChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Student-wise average (anonymous view)</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentWiseAvg}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#9aa0a6', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="avg" name="Average %" radius={[4, 4, 0, 0]}>
                {studentWiseAvg.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
