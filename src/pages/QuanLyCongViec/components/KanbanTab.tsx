import type { FC } from 'react';
import { Button, Card, Col, Empty, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { CalendarOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import moment from 'moment';
import type { Task, TaskStatus } from '../typing';

interface KanbanTabProps {
	tasks: Task[];
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
	onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const KanbanTab: FC<KanbanTabProps> = ({ tasks, onEdit, onDelete, onUpdateStatus }) => {
	const onDragEnd = (result: DropResult) => {
		const destination = result.destination;
		const source = result.source;

		if (!destination) {
			return;
		}

		if (destination.droppableId === source.droppableId) {
			return;
		}

		onUpdateStatus(result.draggableId, destination.droppableId as TaskStatus);
	};

	const getPriorityText = (priority: Task['priority']) => {
		if (priority === 'high') {
			return 'Cao';
		}

		if (priority === 'medium') {
			return 'Trung bình';
		}

		return 'Thấp';
	};

	const getPriorityColor = (priority: Task['priority']) => {
		if (priority === 'high') {
			return 'red';
		}

		if (priority === 'medium') {
			return 'gold';
		}

		return 'green';
	};

	const getTasksByStatus = (status: TaskStatus) => {
		const result: Task[] = [];

		tasks.forEach((task) => {
			if (task.status === status) {
				result.push(task);
			}
		});

		return result;
	};

	const renderTags = (task: Task) => {
		if (task.tags.length === 0) {
			return null;
		}

		return (
			<Space wrap size={[0, 4]}>
				{task.tags.map((tag) => (
					<Tag key={tag}>{tag}</Tag>
				))}
			</Space>
		);
	};

	const renderTaskCard = (task: Task, index: number, borderColor: string) => {
		const isOverdue = task.status !== 'done' && moment(task.deadline).isBefore(moment(), 'day');

		const handleEditClick = () => {
			onEdit(task);
		};

		const handleDeleteClick = () => {
			onDelete(task.id);
		};

		let cardBorderColor = borderColor;
		if (isOverdue) {
			cardBorderColor = '#ff4d4f';
		}

		return (
			<Draggable draggableId={task.id} index={index} key={task.id}>
				{(dragProvided, dragSnapshot) => (
					<Card
						ref={dragProvided.innerRef}
						{...dragProvided.draggableProps}
						{...dragProvided.dragHandleProps}
						size='small'
						bodyStyle={{ padding: 14 }}
						style={{
							borderLeft: `4px solid ${cardBorderColor}`,
							marginBottom: 12,
							boxShadow: dragSnapshot.isDragging
								? '0 6px 14px rgba(0, 0, 0, 0.14)'
								: '0 1px 2px rgba(0, 0, 0, 0.04)',
							transition: 'box-shadow 0.28s ease, border-color 0.28s ease',
							...dragProvided.draggableProps.style,
						}}
					>
						<Space direction='vertical' size={10} style={{ width: '100%' }}>
							<Space align='start' style={{ justifyContent: 'space-between', width: '100%' }}>
								<Typography.Text strong style={{ lineHeight: '22px' }}>
									{task.title}
								</Typography.Text>
								<Space size={0}>
									<Tooltip title='Chỉnh sửa'>
										<Button size='small' type='text' icon={<EditOutlined />} onClick={handleEditClick} />
									</Tooltip>
									<Tooltip title='Xóa'>
										<Button danger size='small' type='text' icon={<DeleteOutlined />} onClick={handleDeleteClick} />
									</Tooltip>
								</Space>
							</Space>

							{task.description ? (
								<Typography.Paragraph ellipsis={{ rows: 2 }} style={{ color: '#595959', marginBottom: 0 }}>
									{task.description}
								</Typography.Paragraph>
							) : null}

							<Space wrap>
								<Tag color={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Tag>
								<Tag icon={<CalendarOutlined />} color={isOverdue ? 'red' : 'blue'}>
									{moment(task.deadline).format('DD/MM/YYYY')}
								</Tag>
							</Space>

							{renderTags(task)}
						</Space>
					</Card>
				)}
			</Draggable>
		);
	};

	const renderColumn = (
		status: TaskStatus,
		title: string,
		countColor: string,
		backgroundColor: string,
		borderColor: string,
	) => {
		const listTask = getTasksByStatus(status);

		return (
			<Col xs={24} lg={8}>
				<div
					style={{
						background: backgroundColor,
						border: `1px solid ${borderColor}`,
						borderRadius: 8,
						minHeight: 560,
						padding: 12,
					}}
				>
					<Space align='center' style={{ justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
						<Typography.Text strong>{title}</Typography.Text>
						<Tag color={countColor}>{listTask.length}</Tag>
					</Space>

					<Droppable droppableId={status}>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									background: snapshot.isDraggingOver ? 'rgba(22, 119, 255, 0.08)' : 'transparent',
									borderRadius: 6,
									minHeight: 500,
									padding: 4,
									transition: 'background 0.28s ease',
								}}
							>
								{listTask.length === 0 ? (
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có công việc' />
								) : (
									listTask.map((task, index) => renderTaskCard(task, index, borderColor))
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			</Col>
		);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={[16, 16]}>
				{renderColumn('todo', 'Cần làm', 'default', '#fafafa', '#d9d9d9')}
				{renderColumn('inProgress', 'Đang làm', 'processing', '#f0f7ff', '#91caff')}
				{renderColumn('done', 'Hoàn thành', 'success', '#f6ffed', '#b7eb8f')}
			</Row>
		</DragDropContext>
	);
};

export default KanbanTab;
