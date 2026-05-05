export type TaskStatus = 'todo' | 'inProgress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: TaskStatus;
	deadline: string;
	priority: TaskPriority;
	tags: string[];
}
