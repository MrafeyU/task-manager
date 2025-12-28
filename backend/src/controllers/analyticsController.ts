import type { Request, Response } from 'express';
import Task from '../models/taskModel.js';

// GET /analytics/overview - Summary stats
export const getAnalyticsOverview = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        
        const [
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            overdueTasks
        ] = await Promise.all([
            Task.countDocuments({
                $or: [{ owner: userId }, { sharedWith: userId }]
            }),
            Task.countDocuments({
                $or: [{ owner: userId }, { sharedWith: userId }],
                status: 'completed'
            }),
            Task.countDocuments({
                $or: [{ owner: userId }, { sharedWith: userId }],
                status: 'pending'
            }),
            Task.countDocuments({
                $or: [{ owner: userId }, { sharedWith: userId }],
                status: 'in-progress'
            }),
            Task.countDocuments({
                $or: [{ owner: userId }, { sharedWith: userId }],
                status: { $ne: 'completed' },
                dueDate: { $lt: new Date() }
            })
        ]);

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            overdueTasks
        });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch analytics overview', details: error });
    }
};

// GET /analytics/trends - Weekly/monthly trends
export const getAnalyticsTrends = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        const period = (req.query.period as string) || 'monthly'; // 'weekly' or 'monthly'
        
        const now = new Date();
        let startDate: Date;
        
        if (period === 'weekly') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        }

        // Get completed tasks grouped by date
        const completedTasks = await Task.aggregate([
            {
                $match: {
                    $or: [{ owner: userId }, { sharedWith: userId }],
                    status: 'completed',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === 'weekly' ? '%Y-%m-%d' : '%Y-%m',
                            date: '$createdAt'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get overdue tasks grouped by date
        const overdueTasks = await Task.aggregate([
            {
                $match: {
                    $or: [{ owner: userId }, { sharedWith: userId }],
                    status: { $ne: 'completed' },
                    dueDate: { $lt: new Date(), $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === 'weekly' ? '%Y-%m-%d' : '%Y-%m',
                            date: '$dueDate'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            period,
            completed: completedTasks.map(item => ({ date: item._id, count: item.count })),
            overdue: overdueTasks.map(item => ({ date: item._id, count: item.count }))
        });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch analytics trends', details: error });
    }
};

