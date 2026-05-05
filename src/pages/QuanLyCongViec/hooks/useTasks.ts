import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Task, TaskStatus } from '../typing';

const STORAGE_KEY = 'personal-task-manager.tasks';

const defaultTasks: Task[] = [
	{
		id: 'task-1',
		title: 'Rà soát kế hoạch tuần',
		description: 'Tổng hợp các đầu việc quan trọng và cập nhật mức ưu tiên.',
		status: 'todo',
		deadline: '2026-05-08',
		priority: 'high',
		tags: ['Planning', 'Weekly'],
	},
	{
		id: 'task-2',
		title: 'Hoàn thiện giao diện Kanban',
		description: 'Kiểm tra luồng kéo thả và trạng thái sau khi cập nhật.',
		status: 'inProgress',
		deadline: '2026-05-06',
		priority: 'medium',
		tags: ['Frontend'],
	},
	{
		id: 'task-3',
		title: 'Gửi báo cáo công việc',
		description: 'Chuẩn bị nội dung báo cáo và gửi cho quản lý trực tiếp.',
		status: 'done',
		deadline: '2026-05-03',
		priority: 'low',
		tags: ['Report'],
	},
];

const canUseLocalStorage = () => {
	if (typeof window === 'undefined') {
		return false;
	}

	if (!window.localStorage) {
		return false;
	}

	return true;
};

const loadTasks = (): Task[] => {
	if (!canUseLocalStorage()) {
		return defaultTasks;
	}

	const dataInStorage = window.localStorage.getItem(STORAGE_KEY);
	if (!dataInStorage) {
		return defaultTasks;
	}

	try {
		const parsedData = JSON.parse(dataInStorage);

		if (Array.isArray(parsedData)) {
			return parsedData;
		}

		return defaultTasks;
	} catch {
		return defaultTasks;
	}
};

const createTaskId = () => {
	const randomText = Math.random().toString(36).slice(2, 8);
	return `task-${Date.now()}-${randomText}`;
};

export const useTasks = () => {
	const [tasks, setTasks] = useState<Task[]>(loadTasks);

	useEffect(() => {
		if (canUseLocalStorage()) {
			const taskJson = JSON.stringify(tasks);
			window.localStorage.setItem(STORAGE_KEY, taskJson);
		}
	}, [tasks]);

	const addTask = useCallback((task: Omit<Task, 'id'>) => {
		const newTask: Task = {
			...task,
			id: createTaskId(),
		};

		setTasks((currentTasks) => {
			return [newTask, ...currentTasks];
		});
	}, []);

	const updateTask = useCallback((taskId: string, payload: Partial<Omit<Task, 'id'>>) => {
		setTasks((currentTasks) => {
			return currentTasks.map((task) => {
				if (task.id === taskId) {
					return {
						...task,
						...payload,
					};
				}

				return task;
			});
		});
	}, []);

	const deleteTask = useCallback((taskId: string) => {
		setTasks((currentTasks) => {
			return currentTasks.filter((task) => task.id !== taskId);
		});
	}, []);

	const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
		setTasks((currentTasks) => {
			return currentTasks.map((task) => {
				if (task.id === taskId) {
					return {
						...task,
						status,
					};
				}

				return task;
			});
		});
	}, []);

	const statistics = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let completed = 0;
		let overdue = 0;

		tasks.forEach((task) => {
			if (task.status === 'done') {
				completed += 1;
			}

			if (task.status !== 'done' && new Date(task.deadline) < today) {
				overdue += 1;
			}
		});

		return {
			total: tasks.length,
			completed,
			overdue,
		};
	}, [tasks]);

	return {
		tasks,
		statistics,
		addTask,
		updateTask,
		deleteTask,
		updateTaskStatus,
	};
};

export type UseTasksResult = ReturnType<typeof useTasks>;
