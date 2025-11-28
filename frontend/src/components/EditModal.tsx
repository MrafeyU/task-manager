import { useState, useEffect } from "react";
import { API_URL } from '../config';
import { getToken } from '../auth';

interface EditModalProps {
  show: boolean;
  task: any;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditModal({ show, task, onClose, onUpdated }: EditModalProps) {  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
    console.log("EDIT MODAL RECEIVED TASK:", task);
  }, [task]);

  if (!show) return null;

  const handleUpdate = async () => {
    const updatedTask = { title, description, status };

    try {
      const token = getToken();
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Update failed', err);
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-xl space-y-4 transform transition duration-200 ease-out scale-100 animate-fade-in">
        <h2 className="text-xl font-bold">Edit Task</h2>

        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
