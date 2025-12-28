import { useState, useEffect, useRef } from "react";
import { API_URL } from '../config';
import { getToken } from '../auth';
import { Paperclip } from 'lucide-react';

interface TaskAttachment {
  _id?: string;
  filename?: string;
  originalName: string;
  path: string;
  size: number;
  mimetype?: string;
  uploadedAt?: Date | string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date | string;
  createdAt?: Date | string;
  attachments?: TaskAttachment[];
}

interface EditModalProps {
  show: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditModal({ show, task, onClose, onUpdated }: EditModalProps) {  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>("pending");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when task changes - using key prop approach to avoid setState in effect
  const taskId = task?._id || '';
  
  // Initialize/reset form state when task changes
  useEffect(() => {
    if (!task) {
      setTitle("");
      setDescription("");
      setStatus("pending");
      return;
    }
    // Only update if task actually changed
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "pending");
    console.log("EDIT MODAL RECEIVED TASK:", task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]); // Only depend on task ID to avoid unnecessary resets

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!task) return;
    
    try {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/tasks/${task._id}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        onUpdated();
      }
    } catch (err) {
      console.error('Failed to delete attachment', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!show) return null;

  const handleUpdate = async () => {
    if (!task) return;
    
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);

      // Add files to form data
      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      // Don't set Content-Type for FormData, browser will set it with boundary

      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "PUT",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Update failed', err);
      } else {
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUpdated();
        onClose();
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div key={taskId} className="bg-white w-full max-w-md p-4 md:p-8 rounded-2xl shadow-2xl space-y-4 md:space-y-5 transform transition duration-200 ease-out animate-fade-in border border-gray-200 my-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <input
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />

        <select
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Attachments */}
        {task?.attachments && task.attachments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Attachments
            </label>
            <div className="space-y-2">
              {task.attachments.map((attachment: TaskAttachment) => {
                const attachmentId = attachment._id || attachment.filename || '';
                return (
                  <div key={attachmentId} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                    <a
                      href={`${API_URL}${attachment.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Paperclip className="w-4 h-4" />
                      {attachment.originalName}
                      <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                    </a>
                    <button
                      onClick={() => handleDeleteAttachment(attachmentId)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
