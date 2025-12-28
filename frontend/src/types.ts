// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TaskAttachment {
  _id?: string;
  filename?: string;
  originalName: string;
  path: string;
  size: number;
  mimetype?: string;
  uploadedAt?: Date | string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: string | Date;
  createdAt?: string | Date;
  owner?: string | User;
  sharedWith?: Array<string | User>;
  attachments?: TaskAttachment[];
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

export type Headers = Record<string, string>;

export interface TrendItem {
  date: string;
  count: number;
}

export interface OverviewData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

export interface TrendsData {
  period: string;
  completed: TrendItem[];
  overdue: TrendItem[];
}
