import TaskCard from "../components/TaskCard";
import { useState, useEffect, useCallback } from "react";
import ModelForm from "../components/ModelForm";
import Button from '../components/Button';
import EditModal from "../components/EditModal";
import { API_URL } from '../config';
import { getToken } from '../auth';
import { ClipboardList } from 'lucide-react';
import type { Task, Headers, OverviewData, TrendsData } from '../types';
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
   
type DashboardProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  searchTerm?: string;
};

export default function Dashboard({ showModal, setShowModal, searchTerm = "" }: DashboardProps) {
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Tasks, setTask] = useState<Task[]>([]);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const token = getToken();
      const headers: Headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks`, { headers });
      const data = await res.json();
      setTask(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = getToken();
      const headers: Headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [overviewRes, trendsRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/overview`, { headers }),
        fetch(`${API_URL}/api/analytics/trends?period=${period}`, { headers })
      ]);

      const overviewData = await overviewRes.json() as OverviewData;
      const trendsData = await trendsRes.json() as TrendsData;

      setOverview(overviewData);
      setTrends(trendsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  }, [period]);

  useEffect(() => {
    // These are async functions that set state asynchronously, not direct setState calls
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks();
    void fetchAnalytics();
  }, [fetchTasks, fetchAnalytics]);

  useEffect(() => {
    if (showAnalytics) {
      // This is an async function that sets state asynchronously, not a direct setState call
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchAnalytics();
    }
  }, [showAnalytics, fetchAnalytics]);

  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const headers: Headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE", headers });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const openUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };


  // debug: log modal visibility to help verify Topbar clicks propagate
  useEffect(() => {
    console.log("Dashboard showModal:", showModal);
  }, [showModal]);

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

  const trendData = (() => {
    if (!trends) return [];
    const completed = trends.completed || [];
    const overdue = trends.overdue || [];
    const dateSet = new Set<string>();
    completed.forEach(i => dateSet.add(i.date));
    overdue.forEach(i => dateSet.add(i.date));
    const allDates = Array.from(dateSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return allDates.map(date => ({
      date,
      completed: completed.find(i => i.date === date)?.count || 0,
      overdue: overdue.find(i => i.date === date)?.count || 0
    }));
  })();

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Manage and track your tasks efficiently</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </Button>
      </div>

      {/* Analytics Section */}
      {showAnalytics && overview && (
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Analytics</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={period === 'weekly' ? 'primary' : 'secondary'}
                className="px-4 py-2 rounded-lg text-sm"
                onClick={() => setPeriod('weekly')}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={period === 'monthly' ? 'primary' : 'secondary'}
                className="px-4 py-2 rounded-lg text-sm"
                onClick={() => setPeriod('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-xs md:text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className={`text-2xl md:text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown Pie Chart */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">
                Status Breakdown
              </h3>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
                <div className="h-48 sm:h-56 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Trends Line Chart */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">
                {period === 'weekly' ? 'Weekly' : 'Monthly'} Trends
              </h3>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
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
                <div className="h-48 sm:h-56 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Bar Chart for Comparison */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg lg:col-span-2">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">
                Completed vs Overdue Tasks
              </h3>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
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
                <div className="h-48 sm:h-56 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator: percentage of completed tasks */}
      <ProgressIndicator tasks={Tasks} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Tasks.filter((t: Task) => {
          const q = (searchTerm || "").toLowerCase();
          if (!q) return true;
          return (
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
          );
        }).map((task: Task) => (
          <TaskCard 
                key={task._id} 
                task={task}
                onDelete={handleDelete}
                onEdit={openUpdateModal}
            />
        ))}
      </div>
      
      {Tasks.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600">No tasks yet. Create your first task!</p>
        </div>
      )}

      <ModelForm 
        showModal={showModal} 
        setShowModal={setShowModal} 
        onTaskAdded={fetchTasks} 
      />
      <EditModal
        show={showEditModal}
        task={selectedTask}
        onClose={() => setShowEditModal(false)}
        onUpdated={fetchTasks}
      />

    </div>
    
  );
}

function ProgressIndicator({ tasks }: { tasks: Task[] }) {
  const total = tasks.length || 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  // choose bar class based on completion percentage
  let barClass = 'bg-gradient-to-r from-blue-600 to-purple-600';
  if (pct === 100) barClass = 'bg-gradient-to-r from-green-400 to-green-600';
  else if (pct < 50) barClass = 'bg-gradient-to-r from-yellow-400 to-yellow-500';

  const pctTextClass = pct === 100 ? 'text-green-600' : pct < 50 ? 'text-yellow-600' : 'text-gray-900';

  return (
    <div className="mb-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Overall Progress</div>
          <div className={`text-3xl font-bold ${pctTextClass}`}>{pct}%</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{completed}/{total}</div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-5 mb-4 overflow-hidden border border-gray-100">
        <div 
          className={`${barClass} h-5 rounded-full transition-all duration-500 text-white`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
}

