import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { Button, Card, Col, Input, Popconfirm, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { Task, TaskPriority, TaskStatus } from '../typing';

interface TaskListTabProps {
	tasks: Task[];
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
}

type StatusFilter = TaskStatus | 'all';
type PriorityFilter = TaskPriority | 'all';

const TaskListTab: FC<TaskListTabProps> = ({ tasks, onEdit, onDelete }) => {
	const [keyword, setKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
	const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

	const getStatusText = (status: TaskStatus) => {
		if (status === 'todo') {
			return 'Cần làm';
		}

		if (status === 'inProgress') {
			return 'Đang làm';
		}

		return 'Hoàn thành';
	};

	const getStatusColor = (status: TaskStatus) => {
		if (status === 'done') {
			return 'success';
		}

		if (status === 'inProgress') {
			return 'processing';
		}

		return 'default';
	};

	const getPriorityText = (priority: TaskPriority) => {
		if (priority === 'high') {
			return 'Cao';
		}

		if (priority === 'medium') {
			return 'Trung bình';
		}

		return 'Thấp';
	};

	const getPriorityColor = (priority: TaskPriority) => {
		if (priority === 'high') {
			return 'red';
		}

		if (priority === 'medium') {
			return 'gold';
		}

		return 'green';
	};

	const getPriorityPoint = (priority: TaskPriority) => {
		if (priority === 'high') {
			return 3;
		}

		if (priority === 'medium') {
			return 2;
		}

		return 1;
	};

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
	};

	const handleStatusChange = (value: StatusFilter) => {
		setStatusFilter(value);
	};

	const handlePriorityChange = (value: PriorityFilter) => {
		setPriorityFilter(value);
	};

	const isMatchKeyword = (task: Task) => {
		const textSearch = keyword.trim().toLowerCase();

		if (textSearch === '') {
			return true;
		}

		if (task.title.toLowerCase().includes(textSearch)) {
			return true;
		}

		if (task.description && task.description.toLowerCase().includes(textSearch)) {
			return true;
		}

		for (let i = 0; i < task.tags.length; i += 1) {
			if (task.tags[i].toLowerCase().includes(textSearch)) {
				return true;
			}
		}

		return false;
	};

	const isMatchFilter = (task: Task) => {
		if (statusFilter !== 'all' && task.status !== statusFilter) {
			return false;
		}

		if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
			return false;
		}

		return true;
	};

	const getFilteredTasks = () => {
		const result: Task[] = [];

		tasks.forEach((task) => {
			if (isMatchKeyword(task) && isMatchFilter(task)) {
				result.push(task);
			}
		});

		return result;
	};

	const renderTaskInfo = (_value: string, task: Task) => {
		return (
			<Space direction='vertical' size={4}>
				<Typography.Text strong>{task.title}</Typography.Text>
				{task.description ? (
					<Typography.Text type='secondary' ellipsis style={{ maxWidth: 420 }}>
						{task.description}
					</Typography.Text>
				) : null}
			</Space>
		);
	};

	const renderStatus = (status: TaskStatus) => {
		return <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>;
	};

	const renderPriority = (priority: TaskPriority) => {
		return <Tag color={getPriorityColor(priority)}>{getPriorityText(priority)}</Tag>;
	};

	const renderDeadline = (deadline: string, task: Task) => {
		const isOverdue = task.status !== 'done' && moment(deadline).isBefore(moment(), 'day');

		if (isOverdue) {
			return (
				<Space direction='vertical' size={0}>
					<Typography.Text type='danger'>{moment(deadline).format('DD/MM/YYYY')}</Typography.Text>
					<Typography.Text type='danger'>Quá hạn</Typography.Text>
				</Space>
			);
		}

		return <Typography.Text>{moment(deadline).format('DD/MM/YYYY')}</Typography.Text>;
	};

	const renderTags = (tags: string[]) => {
		if (tags.length === 0) {
			return <Typography.Text type='secondary'>-</Typography.Text>;
		}

		return (
			<Space wrap size={[0, 4]}>
				{tags.map((tag) => (
					<Tag key={tag}>{tag}</Tag>
				))}
			</Space>
		);
	};

	const renderActions = (_value: unknown, task: Task) => {
		const editThisTask = () => {
			onEdit(task);
		};

		const deleteThisTask = () => {
			onDelete(task.id);
		};

		return (
			<Space>
				<Tooltip title='Chỉnh sửa'>
					<Button type='text' icon={<EditOutlined />} onClick={editThisTask} />
				</Tooltip>
				<Popconfirm
					title='Bạn có chắc chắn muốn xóa công việc này?'
					okText='Xóa'
					cancelText='Hủy'
					onConfirm={deleteThisTask}
				>
					<Tooltip title='Xóa'>
						<Button danger type='text' icon={<DeleteOutlined />} />
					</Tooltip>
				</Popconfirm>
			</Space>
		);
	};

	const columns: ColumnsType<Task> = [
		{
			title: 'Công việc',
			dataIndex: 'title',
			sorter: (firstTask, secondTask) => firstTask.title.localeCompare(secondTask.title),
			render: renderTaskInfo,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 140,
			filters: [
				{ text: 'Cần làm', value: 'todo' },
				{ text: 'Đang làm', value: 'inProgress' },
				{ text: 'Hoàn thành', value: 'done' },
			],
			onFilter: (value, task) => task.status === value,
			render: renderStatus,
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			width: 130,
			filters: [
				{ text: 'Cao', value: 'high' },
				{ text: 'Trung bình', value: 'medium' },
				{ text: 'Thấp', value: 'low' },
			],
			onFilter: (value, task) => task.priority === value,
			sorter: (firstTask, secondTask) => getPriorityPoint(firstTask.priority) - getPriorityPoint(secondTask.priority),
			render: renderPriority,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			width: 140,
			sorter: (firstTask, secondTask) => moment(firstTask.deadline).valueOf() - moment(secondTask.deadline).valueOf(),
			render: renderDeadline,
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			render: renderTags,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			render: renderActions,
		},
	];

	const filteredTasks = getFilteredTasks();

	return (
		<Card
			title='Danh sách công việc'
			extra={<Typography.Text type='secondary'>{filteredTasks.length} kết quả</Typography.Text>}
		>
			<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={12} xl={10}>
					<Input
						allowClear
						prefix={<SearchOutlined />}
						placeholder='Tìm theo tiêu đề, mô tả hoặc tag'
						value={keyword}
						onChange={handleSearchChange}
					/>
				</Col>
				<Col xs={24} sm={12} md={6} xl={5}>
					<Select<StatusFilter> value={statusFilter} style={{ width: '100%' }} onChange={handleStatusChange}>
						<Select.Option value='all'>Tất cả trạng thái</Select.Option>
						<Select.Option value='todo'>Cần làm</Select.Option>
						<Select.Option value='inProgress'>Đang làm</Select.Option>
						<Select.Option value='done'>Hoàn thành</Select.Option>
					</Select>
				</Col>
				<Col xs={24} sm={12} md={6} xl={5}>
					<Select<PriorityFilter>
						value={priorityFilter}
						style={{ width: '100%' }}
						onChange={handlePriorityChange}
					>
						<Select.Option value='all'>Tất cả ưu tiên</Select.Option>
						<Select.Option value='high'>Cao</Select.Option>
						<Select.Option value='medium'>Trung bình</Select.Option>
						<Select.Option value='low'>Thấp</Select.Option>
					</Select>
				</Col>
			</Row>

			<Table
				rowKey='id'
				columns={columns}
				dataSource={filteredTasks}
				pagination={{ pageSize: 8, showSizeChanger: true }}
				scroll={{ x: 960 }}
				size='middle'
			/>
		</Card>
	);
};

export default TaskListTab;
