import type { Request, Response, NextFunction } from 'express';

// Basic request validation middleware for Task create/update
// Validates: title (required, non-empty), status (if present must be one of allowed), dueDate (if present must be a valid date)
const allowedStatuses = ['pending', 'in-progress', 'completed'];

const validateTask = (req: Request, res: Response, next: NextFunction) => {
	const { title, status, dueDate } = req.body;
	const errors: string[] = [];

	if (!title || typeof title !== 'string' || title.trim().length === 0) {
		errors.push('Title is required and must be a non-empty string.');
	}

	if (status && !allowedStatuses.includes(String(status))) {
		errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
	}

	if (dueDate) {
		const d = new Date(dueDate);
		if (Number.isNaN(d.getTime())) {
			errors.push('dueDate must be a valid date string (ISO or YYYY-MM-DD).');
		}
	}

	if (errors.length) {
		return res.status(400).json({ errors });
	}

	return next();
};

export default validateTask;
