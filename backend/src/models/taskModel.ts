import mongoose, { Schema, model } from 'mongoose';

interface ITask {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt?: Date;
  user?: any;
  owner: any;
  sharedWith: any[];
  attachments?: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
    uploadedAt: Date;
  }>;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
});

const Task = model<ITask>('Task', taskSchema);
export default Task;
