'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MetricsCollector } from '@/monitoring/metrics.config';

interface MetricValue {
  timestamp: number;
  value: number;
  average: number;
  min: number;
  max: number;
}

interface DashboardStats {
  errorRate: number;
  apiResponseTime: number;
  activeUsers: number;
  lessonsGenerated: number;
  paymentsProcessed: number;
  resourcesSaved: number;
  databaseQueryTime: number;
  uptime: number;
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Record<string, MetricValue[]>>({});
  const [stats, setStats] = useState<DashboardStats>({
    errorRate: 0,
    apiResponseTime: 0,
    activeUsers: 0,
    lessonsGenerated: 0,
    paymentsProcessed: 0,
    resourcesSaved: 0,
    databaseQueryTime: 0,
    uptime: 99.9,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        const data = await response.json();

        setMetrics(data.timeSeries);
        setStats({
          errorRate: data.current.errorRate,
          apiResponseTime: data.current.apiResponseTime,
          activeUsers: data.current.activeUsers,
          lessonsGenerated: data.current.lessonsGenerated,
          paymentsProcessed: data.current.paymentsProcessed,
          resourcesSaved: data.current.resourcesSaved,
          databaseQueryTime: data.current.databaseQueryTime,
          uptime: data.current.uptime,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, unit, alert }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-coral">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-charcoal mt-2">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-lg text-gray-400 ml-2">{unit}</span>
      </p>
      {alert && (
        <p className="text-xs text-red-500 mt-2">
          ⚠️ Alert: {alert}
        </p>
      )}
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center">Loading metrics...</div>;
  }

  const errorRateAlert = stats.errorRate > 1 ? 'High error rate detected' : undefined;
  const apiAlert = stats.apiResponseTime > 1000 ? 'Slow API response' : undefined;
  const dbAlert = stats.databaseQueryTime > 500 ? 'Slow database queries' : undefined;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-charcoal mb-8">Metrics Dashboard</h1>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Error Rate"
          value={stats.errorRate}
          unit="%"
          alert={errorRateAlert}
        />
        <StatCard
          title="API Response Time"
          value={stats.apiResponseTime}
          unit="ms"
          alert={apiAlert}
        />
        <StatCard
          title="Database Query Time"
          value={stats.databaseQueryTime}
          unit="ms"
          alert={dbAlert}
        />
        <StatCard
          title="Uptime"
          value={stats.uptime}
          unit="%"
        />
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Daily Active Users"
          value={stats.activeUsers}
          unit="users"
        />
        <StatCard
          title="Lessons Generated"
          value={stats.lessonsGenerated}
          unit="lessons"
        />
        <StatCard
          title="Payments Processed"
          value={stats.paymentsProcessed}
          unit="payments"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Error Rate Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Error Rate Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={metrics.errorRate || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorError)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* API Response Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-charcoal mb-4">API Response Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={metrics.apiResponseTime || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                dot={false}
                name="Current"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#10B981"
                dot={false}
                strokeDasharray="5 5"
                name="Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lessons Generated */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Lessons Generated (24h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={metrics.lessonsGenerated || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payments Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Payment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Successful', value: stats.paymentsProcessed * 0.98 },
                  { name: 'Failed', value: stats.paymentsProcessed * 0.02 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Active Alerts</h2>
        <div className="space-y-2">
          {errorRateAlert && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              🚨 {errorRateAlert}
            </div>
          )}
          {apiAlert && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              ⚠️ {apiAlert}
            </div>
          )}
          {dbAlert && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              ⚠️ {dbAlert}
            </div>
          )}
          {!errorRateAlert && !apiAlert && !dbAlert && (
            <div className="p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
              ✅ All systems healthy
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
