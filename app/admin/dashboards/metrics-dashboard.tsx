'use client';

import React, { useEffect, useState } from 'react';

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
        setStats({
          errorRate: data.current?.errorRate || 0,
          apiResponseTime: data.current?.apiResponseTime || 0,
          activeUsers: data.current?.activeUsers || 0,
          lessonsGenerated: data.current?.lessonsGenerated || 0,
          paymentsProcessed: data.current?.paymentsProcessed || 0,
          resourcesSaved: data.current?.resourcesSaved || 0,
          databaseQueryTime: data.current?.databaseQueryTime || 0,
          uptime: data.current?.uptime || 99.9,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, unit }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-coral">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-charcoal mt-2">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-lg text-gray-400 ml-2">{unit}</span>
      </p>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center">Loading metrics...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-charcoal mb-8">Metrics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Error Rate" value={stats.errorRate} unit="%" />
        <StatCard title="API Response Time" value={stats.apiResponseTime} unit="ms" />
        <StatCard title="Database Query Time" value={stats.databaseQueryTime} unit="ms" />
        <StatCard title="Uptime" value={stats.uptime} unit="%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Daily Active Users" value={stats.activeUsers} unit="users" />
        <StatCard title="Lessons Generated" value={stats.lessonsGenerated} unit="lessons" />
        <StatCard title="Payments Processed" value={stats.paymentsProcessed} unit="payments" />
      </div>
    </div>
  );
}
