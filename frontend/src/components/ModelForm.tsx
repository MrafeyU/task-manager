import { useState } from "react";
import { API_URL } from '../config';
import { getToken } from '../auth';

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

    const newTask: any = {
      title,
      description,
      status
    };

    if (due) newTask.dueDate = due;

    try {
      const token = getToken();
      const headers: any = { "Content-Type": "application/json" };
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white w-150 p-8 rounded-xl shadow-lg space-y-4 transform transition duration-200 ease-out scale-100 md:scale-100 animate-fade-in">

        <h2 className="text-xl font-bold">Add New Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          className="w-full border rounded-lg p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          className="w-full border rounded-lg p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full border rounded-lg p-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          type="time"
          className="w-full border rounded-lg p-2"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />

        <select
        className="w-full border rounded-lg p-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
        >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        </select>

        

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}