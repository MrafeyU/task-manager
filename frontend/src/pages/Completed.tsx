import TaskCard from "../components/TaskCard";
import { useState, useEffect } from "react";
import EditModal from "../components/EditModal";
import { API_URL } from '../config';

type CompletedProps = {
  searchTerm?: string;
};

export default function Completed({ searchTerm = "" }: CompletedProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = (await import('../auth')).getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks`, { headers });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = tasks
    .filter((t) => t.status === "completed")
    .filter((t) => {
      const q = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Completed Tasks
        </h2>
        <p className="text-gray-600">View your completed tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={async (id: string) => {
              try {
                const token = (await import('../auth')).getToken();
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE', headers });
                fetchTasks();
              } catch (err) {
                console.error('Failed to delete', err);
              }
            }}
            onEdit={(t:any) => {
              setSelectedTask(t);
              setShowEditModal(true);
            }}
          />
        ))}
      </div>

      <EditModal
        show={showEditModal}
        task={selectedTask}
        onClose={() => setShowEditModal(false)}
        onUpdated={fetchTasks}
      />

    </div>
  );
}
