import type { FC } from 'react';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tabs, message } from 'antd';
import DashboardTab from './components/DashboardTab';
import KanbanTab from './components/KanbanTab';
import TaskFormModal from './components/TaskFormModal';
import TaskListTab from './components/TaskListTab';
import { useTasks } from './hooks/useTasks';
import type { Task } from './typing';

const { TabPane } = Tabs;

const QuanLyCongViecPage: FC = () => {
	const { tasks, statistics, addTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task>();

	const openCreateModal = () => {
		setEditingTask(undefined);
		setModalVisible(true);
	};

	const openEditModal = (task: Task) => {
		setEditingTask(task);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
		setEditingTask(undefined);
	};

	const handleSubmitTask = (taskPayload: Omit<Task, 'id'>) => {
		if (editingTask) {
			updateTask(editingTask.id, taskPayload);
			message.success('Đã cập nhật công việc');
		} else {
			addTask(taskPayload);
			message.success('Đã thêm công việc');
		}

		closeModal();
	};

	const handleDeleteTask = (taskId: string) => {
		deleteTask(taskId);
		message.success('Đã xóa công việc');
	};

	const renderCreateButton = () => {
		return (
			<Button type='primary' icon={<PlusOutlined />} onClick={openCreateModal} key='create-task'>
				Thêm công việc
			</Button>
		);
	};

	return (
		<PageContainer title='Theo dõi công việc cá nhân' extra={[renderCreateButton()]}>
			<Tabs defaultActiveKey='dashboard'>
				<TabPane tab='Dashboard' key='dashboard'>
					<DashboardTab tasks={tasks} statistics={statistics} />
				</TabPane>

				<TabPane tab='Kanban Board' key='kanban'>
					<KanbanTab
						tasks={tasks}
						onEdit={openEditModal}
						onDelete={handleDeleteTask}
						onUpdateStatus={updateTaskStatus}
					/>
				</TabPane>

				<TabPane tab='Danh sách Task' key='task-list'>
					<TaskListTab tasks={tasks} onEdit={openEditModal} onDelete={handleDeleteTask} />
				</TabPane>
			</Tabs>

			<TaskFormModal
				visible={modalVisible}
				editingTask={editingTask}
				onCancel={closeModal}
				onSubmit={handleSubmitTask}
			/>
		</PageContainer>
	);
};

export default QuanLyCongViecPage;
