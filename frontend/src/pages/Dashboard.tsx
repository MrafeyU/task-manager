import TaskCard from "../components/TaskCard";
import { useState, useEffect } from "react";
import ModelForm from "../components/ModelForm";
import EditModal from "../components/EditModal";
import { API_URL } from '../config';
import { getToken } from '../auth';
   
type DashboardProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  searchTerm?: string;
};

export default function Dashboard({ showModal, setShowModal, searchTerm = "" }: DashboardProps) {
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Tasks, setTask] = useState([]);
  const fetchTasks = async () => {
    try {
      const token = getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks`, { headers });
      const data = await res.json();
      setTask(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  } , []);
  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE", headers });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const openUpdateModal = (task: any) => {
  setSelectedTask(task);
  setShowEditModal(true);
  };


  // debug: log modal visibility to help verify Topbar clicks propagate
  useEffect(() => {
    console.log("Dashboard showModal:", showModal);
  }, [showModal]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Tasks</h2>

      {/* Progress indicator: percentage of completed tasks */}
      <ProgressIndicator tasks={Tasks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Tasks.filter((t:any) => {
          const q = (searchTerm || "").toLowerCase();
          if (!q) return true;
          return (
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
          );
        }).map((task: any) => (
          <TaskCard 
                key={task._id} 
                task={task}
                onDelete={handleDelete}
                onEdit={openUpdateModal}
            />
        ))}

      </div>
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

function ProgressIndicator({ tasks }: { tasks: any[] }) {
  const total = tasks.length || 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-gray-700">Progress</div>
        <div className="text-sm font-medium text-gray-700">{pct}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

