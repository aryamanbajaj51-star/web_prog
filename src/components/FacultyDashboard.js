import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import Layout from './Layout';
import { useResults } from '../context/ResultsContext';
import { useAuth } from '../context/AuthContext';
import ResultEditor from './ResultEditor';
import './Dashboard.css';

const COLORS = ['#6d8cff', '#5dd9a8', '#ffb347', '#f07178', '#c792ea'];

export default function FacultyDashboard() {
  const { data, getSubjectStats } = useResults();
  const { canEditResults } = useAuth();

  const subjectStats = useMemo(() => getSubjectStats(), [getSubjectStats]);

  const classAvgChart = useMemo(
    () =>
      subjectStats.map((s) => ({
        subject: s.name,
        avg: s.avg,
        passRate: s.passRate,
      })),
    [subjectStats]
  );

  const studentWise = useMemo(() => {
    return data.students.map((s) => {
      const vals = Object.values(s.results);
      const avg =
        vals.length > 0
          ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
          : 0;
      return {
        name: s.name,
        rollNo: s.rollNo,
        avg,
        ...s.results,
      };
    });
  }, [data]);

  return (
    <Layout title="Faculty — Analyze & Edit Results">
      <div className="dashboard-section">
        <h2>Subject-wise class average & pass rate</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classAvgChart} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="subject" tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
                labelStyle={{ color: '#e8eaed' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="avg" name="Avg marks" fill="#6d8cff" radius={[4, 4, 0, 0]} />
              <Bar
                yAxisId="right"
                dataKey="passRate"
                name="Pass %"
                fill="#5dd9a8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Student-wise average</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentWise}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9aa0a6', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9aa0a6', fontSize: 11 }} width={75} />
              <Tooltip
                contentStyle={{
                  background: '#252a3a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="avg" name="Average %" radius={[0, 4, 4, 0]}>
                {studentWise.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {canEditResults() && (
        <div className="dashboard-section">
          <h2>Edit results (Faculty only)</h2>
          <ResultEditor />
        </div>
      )}
    </Layout>
  );
}
