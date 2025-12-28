import { API_URL } from '../config';
import { Calendar, Paperclip, Check, RefreshCw, Circle } from 'lucide-react';
import type { Task, TaskAttachment } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onShare?: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit, onShare }: TaskCardProps) {
  const { _id, title, description, status, dueDate } = task;
  
  const statusConfig = {
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: Check
    },
    "in-progress": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: RefreshCw
    },
    pending: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Circle
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  const formatDate = (date: string | Date) => {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'completed';

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-lg bg-white flex flex-col gap-3 transform transition-all hover:scale-[1.02] hover:shadow-xl duration-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1 text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Status and Due Date */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${config.bg} ${config.text} ${config.border} flex items-center gap-1`}>
          <config.icon className="w-3 h-3" />
          {status}
        </span>
        {dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'} flex items-center gap-1`}>
            <Calendar className="w-3 h-3" />
            {formatDate(dueDate)}
            {isOverdue && ' (Overdue)'}
          </span>
        )}
      </div>

      {/* Attachments */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Attachments:</div>
          <div className="flex flex-wrap gap-2">
            {task.attachments.slice(0, 3).map((attachment: TaskAttachment, index: number) => (
              <a
                key={index}
                href={`${API_URL}${attachment.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
              >
                <Paperclip className="w-3 h-3" />
                {attachment.originalName.length > 15 ? attachment.originalName.substring(0, 15) + '...' : attachment.originalName}
              </a>
            ))}
            {task.attachments.length > 3 && (
              <span className="text-xs text-gray-500">+{task.attachments.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button
          className="flex-1 px-3 py-2 text-sm text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        {typeof onShare === 'function' && (
          <button
            className="flex-1 px-3 py-2 text-sm text-white bg-linear-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium"
            onClick={() => onShare(task)}
          >
            Share
          </button>
        )}
        <button
          className="px-3 py-2 text-sm text-white bg-linear-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
          onClick={() => onDelete(_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
