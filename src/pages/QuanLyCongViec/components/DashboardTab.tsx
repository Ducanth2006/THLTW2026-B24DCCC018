import type { FC } from 'react';
import { Card, Col, Empty, List, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Task } from '../typing';

interface DashboardTabProps {
	tasks: Task[];
	statistics: {
		total: number;
		completed: number;
		overdue: number;
	};
}

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

const DashboardTab: FC<DashboardTabProps> = ({ tasks, statistics }) => {
	let completionPercent = 0;

	if (statistics.total > 0) {
		completionPercent = Math.round((statistics.completed / statistics.total) * 100);
	}

	const activeTasks = tasks.filter((task) => task.status !== 'done').length;
	const highPriorityTasks = tasks.filter((task) => task.status !== 'done' && task.priority === 'high').length;

	const upcomingTasks = tasks
		.filter((task) => task.status !== 'done')
		.sort((firstTask, secondTask) => {
			return moment(firstTask.deadline).valueOf() - moment(secondTask.deadline).valueOf();
		})
		.slice(0, 5);

	const getProgressColor = () => {
		if (completionPercent >= 80) {
			return '#52c41a';
		}

		return '#1677ff';
	};

	const renderTaskDescription = (task: Task, isOverdue: boolean) => {
		return (
			<Space direction='vertical' size={4}>
				<Space wrap>
					<Tag color={priorityColorMap[task.priority]}>{priorityLabelMap[task.priority]}</Tag>
					<Typography.Text type={isOverdue ? 'danger' : 'secondary'}>
						{moment(task.deadline).format('DD/MM/YYYY')}
					</Typography.Text>
				</Space>
				{task.description && (
					<Typography.Text type='secondary' ellipsis>
						{task.description}
					</Typography.Text>
				)}
			</Space>
		);
	};

	const renderUpcomingTask = (task: Task) => {
		const isOverdue = moment(task.deadline).isBefore(moment(), 'day');

		return (
			<List.Item>
				<List.Item.Meta
					title={
						<Space wrap>
							<Typography.Text strong>{task.title}</Typography.Text>
							{isOverdue && <Tag color='red'>Quá hạn</Tag>}
						</Space>
					}
					description={renderTaskDescription(task, isOverdue)}
				/>
			</List.Item>
		);
	};

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} lg={16}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={8}>
						<Card>
							<Statistic title='Tổng công việc' value={statistics.total} prefix={<ProjectOutlined />} />
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card>
							<Statistic
								title='Hoàn thành'
								value={statistics.completed}
								valueStyle={{ color: '#389e0d' }}
								prefix={<CheckCircleOutlined />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card>
							<Statistic
								title='Quá hạn'
								value={statistics.overdue}
								valueStyle={{ color: '#cf1322' }}
								prefix={<ClockCircleOutlined />}
							/>
						</Card>
					</Col>
				</Row>

				<Card title='Tiến độ trong danh sách' style={{ marginTop: 16 }}>
					<Space direction='vertical' size={12} style={{ width: '100%' }}>
						<Progress percent={completionPercent} strokeColor={getProgressColor()} />
						<Row gutter={16}>
							<Col xs={24} sm={8}>
								<Typography.Text type='secondary'>Đang mở: </Typography.Text>
								<Typography.Text strong>{activeTasks}</Typography.Text>
							</Col>
							<Col xs={24} sm={8}>
								<Typography.Text type='secondary'>Ưu tiên cao: </Typography.Text>
								<Typography.Text strong>{highPriorityTasks}</Typography.Text>
							</Col>
							<Col xs={24} sm={8}>
								<Typography.Text type='secondary'>Tỷ lệ xong: </Typography.Text>
								<Typography.Text strong>{completionPercent}%</Typography.Text>
							</Col>
						</Row>
					</Space>
				</Card>
			</Col>

			<Col xs={24} lg={8}>
				<Card title='Việc cần chú ý' bodyStyle={{ minHeight: 318 }}>
					{upcomingTasks.length > 0 ? (
						<List dataSource={upcomingTasks} renderItem={renderUpcomingTask} />
					) : (
						<Empty description='Không có công việc đang mở' />
					)}
				</Card>
			</Col>
		</Row>
	);
};

export default DashboardTab;
