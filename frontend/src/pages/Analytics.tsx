import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { getToken } from '../auth';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Analytics() {
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [overviewRes, trendsRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/overview`, { headers }),
        fetch(`${API_URL}/api/analytics/trends?period=${period}`, { headers })
      ]);

      const overviewData = await overviewRes.json();
      const trendsData = await trendsRes.json();

      setOverview(overviewData);
      setTrends(trendsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  const statusData = overview ? [
    { name: 'Completed', value: overview.completedTasks, color: COLORS[1] },
    { name: 'In Progress', value: overview.inProgressTasks, color: COLORS[2] },
    { name: 'Pending', value: overview.pendingTasks, color: COLORS[0] }
  ].filter(item => item.value > 0) : [];

  const statsCards = overview ? [
    { label: 'Total Tasks', value: overview.totalTasks, color: 'bg-blue-500' },
    { label: 'Completed', value: overview.completedTasks, color: 'bg-green-500' },
    { label: 'Pending', value: overview.pendingTasks, color: 'bg-yellow-500' },
    { label: 'In Progress', value: overview.inProgressTasks, color: 'bg-purple-500' },
    { label: 'Overdue', value: overview.overdueTasks, color: 'bg-red-500' }
  ] : [];

  // Prepare trend data for charts
  const trendData = trends?.completed?.map((item: any) => {
    const overdueItem = trends?.overdue?.find((o: any) => o.date === item.date);
    return {
      date: item.date,
      completed: item.count,
      overdue: overdueItem?.count || 0
    };
  }) || [];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-white' 
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Status Breakdown
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Trends Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {period === 'weekly' ? 'Weekly' : 'Monthly'} Trends
          </h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Overdue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Bar Chart for Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Completed vs Overdue Tasks
          </h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

