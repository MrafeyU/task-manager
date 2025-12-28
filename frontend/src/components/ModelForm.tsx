import { useState } from "react";
import { API_URL } from '../config';
import { getToken } from '../auth';
import type { TaskInput, Headers } from '../types';

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onTaskAdded: () => void;   // To refresh task list after POST
}

export default function ModelForm({ showModal, setShowModal, onTaskAdded  }: ModalProps){
    const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const handleAddTask = async () => {
    // combine date + time into an ISO string if both provided
    let due: string | undefined = undefined;
    if (dueDate) {
      if (dueTime) {
        due = new Date(`${dueDate}T${dueTime}`).toISOString();
      } else {
        due = new Date(dueDate).toISOString();
      }
    }

    const newTask: TaskInput = {
      title,
      description,
      status
    };

    if (due) newTask.dueDate = due;

    try {
      const token = getToken();
      const headers: Headers = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        // Close modal
        setShowModal(false);

        // Clear inputs
        setTitle("");
        setDescription("");
        setDueDate("");
        setDueTime("");

        // Refresh parent list
        onTaskAdded();
      } else {
        const err = await res.json();
        console.error('Failed to create task', err);
      }
    } catch (err) {
      console.log("Error adding task:", err);
    }
  };

  // If modal is false → render nothing
  if (!showModal) return null;

     return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md p-4 md:p-8 rounded-2xl shadow-2xl space-y-4 md:space-y-5 transform transition duration-200 ease-out animate-fade-in border border-gray-200 my-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Task
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Task Title"
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>

        <select
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}