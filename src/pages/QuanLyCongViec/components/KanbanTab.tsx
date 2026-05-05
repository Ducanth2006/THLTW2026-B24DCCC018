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

const columns: { key: TaskStatus; title: string; color: string; background: string; border: string }[] = [
	{ key: 'todo', title: 'Cần làm', color: 'default', background: '#fafafa', border: '#d9d9d9' },
	{ key: 'inProgress', title: 'Đang làm', color: 'processing', background: '#f0f7ff', border: '#91caff' },
	{ key: 'done', title: 'Hoàn thành', color: 'success', background: '#f6ffed', border: '#b7eb8f' },
];

const priorityColorMap = {
	high: 'red',
	medium: 'gold',
	low: 'green',
};

const priorityLabelMap = {
	high: 'Cao',
	medium: 'Trung bình',
	low: 'Thấp',
};

const KanbanTab: FC<KanbanTabProps> = ({ tasks, onEdit, onDelete, onUpdateStatus }) => {
	const onDragEnd = (result: DropResult) => {
		const { destination, draggableId, source } = result;

		if (!destination || destination.droppableId === source.droppableId) {
			return;
		}

		onUpdateStatus(draggableId, destination.droppableId as TaskStatus);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={[16, 16]}>
				{columns.map((column) => {
					const columnTasks = tasks.filter((task) => task.status === column.key);

					return (
						<Col xs={24} lg={8} key={column.key}>
							<div
								style={{
									background: column.background,
									border: `1px solid ${column.border}`,
									borderRadius: 8,
									minHeight: 560,
									padding: 12,
								}}
							>
								<Space align='center' style={{ justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
									<Typography.Text strong>{column.title}</Typography.Text>
									<Tag color={column.color}>{columnTasks.length}</Tag>
								</Space>

								<Droppable droppableId={column.key}>
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
											{columnTasks.length === 0 ? (
												<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có công việc' />
											) : (
												columnTasks.map((task, index) => {
													const isOverdue = task.status !== 'done' && moment(task.deadline).isBefore(moment(), 'day');

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
																		borderLeft: `4px solid ${isOverdue ? '#ff4d4f' : column.border}`,
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
																					<Button
																						size='small'
																						type='text'
																						icon={<EditOutlined />}
																						onClick={() => onEdit(task)}
																					/>
																				</Tooltip>
																				<Tooltip title='Xóa'>
																					<Button
																						danger
																						size='small'
																						type='text'
																						icon={<DeleteOutlined />}
																						onClick={() => onDelete(task.id)}
																					/>
																				</Tooltip>
																			</Space>
																		</Space>

																		{task.description ? (
																			<Typography.Paragraph
																				ellipsis={{ rows: 2 }}
																				style={{ color: '#595959', marginBottom: 0 }}
																			>
																				{task.description}
																			</Typography.Paragraph>
																		) : null}

																		<Space wrap>
																			<Tag color={priorityColorMap[task.priority]}>
																				{priorityLabelMap[task.priority]}
																			</Tag>
																			<Tag icon={<CalendarOutlined />} color={isOverdue ? 'red' : 'blue'}>
																				{moment(task.deadline).format('DD/MM/YYYY')}
																			</Tag>
																		</Space>

																		{task.tags.length > 0 ? (
																			<Space wrap size={[0, 4]}>
																				{task.tags.map((tag) => (
																					<Tag key={tag}>{tag}</Tag>
																				))}
																			</Space>
																		) : null}
																	</Space>
																</Card>
															)}
														</Draggable>
													);
												})
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						</Col>
					);
				})}
			</Row>
		</DragDropContext>
	);
};

export default KanbanTab;
