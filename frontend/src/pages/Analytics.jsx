import { useState, useEffect } from 'react';
import {
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusMessage from '../components/StatusMessage';
import { getAnalytics } from '../services/api';

const PIE_COLORS = ['#22c55e', '#ef4444'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnalytics();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" message="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <StatusMessage type="error" message={error} />
        <button onClick={fetchData} className="btn-primary mt-4">
          <FiRefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: 'Total Users',
      value: data.total_users,
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Total Auths',
      value: data.total_authentications,
      icon: FiShield,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Successful',
      value: data.successful_authentications,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Failed',
      value: data.failed_authentications,
      icon: FiXCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  const pieData = [
    { name: 'Successful', value: data.successful_authentications },
    { name: 'Failed', value: data.failed_authentications },
  ];

  // Group recent auths by date for bar chart
  const recentByDate = {};
  (data.recent_authentications || []).forEach((auth) => {
    const date = auth.timestamp ? auth.timestamp.split('T')[0] : 'Unknown';
    if (!recentByDate[date]) {
      recentByDate[date] = { date, success: 0, failed: 0 };
    }
    if (auth.success) {
      recentByDate[date].success += 1;
    } else {
      recentByDate[date].failed += 1;
    }
  });
  const barData = Object.values(recentByDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="section-title mb-0">Analytics Dashboard</h1>
          </div>
          <p className="section-subtitle mt-2 mb-0">
            System statistics and authentication metrics overview.
          </p>
        </div>
        <button onClick={fetchData} className="btn-secondary mt-4 sm:mt-0">
          <FiRefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Rate */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Rate</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${data.success_rate}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900 min-w-[80px] text-right">
            {data.success_rate}%
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Auth Outcomes</h3>
          {data.total_authentications > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No authentication data yet
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" name="Successful" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No recent activity data
            </div>
          )}
        </div>
      </div>

      {/* Recent Authentication Log */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Authentications</h3>
        </div>
        {data.recent_authentications && data.recent_authentications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Time</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Score</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recent_authentications.map((auth, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-600">
                      {auth.timestamp
                        ? new Date(auth.timestamp).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {auth.user_id || '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {auth.similarity_score != null
                        ? `${(auth.similarity_score * 100).toFixed(1)}%`
                        : '—'}
                    </td>
                    <td className="px-6 py-3">
                      {auth.success ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiXCircle className="h-3 w-3 mr-1" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            No authentication history available
          </div>
        )}
      </div>
    </div>
  );
}
