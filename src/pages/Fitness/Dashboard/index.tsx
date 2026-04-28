import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import { Card, Col, Row, Space, Tag, Timeline } from 'antd';
import moment from 'moment';
import { useFitnessStore, formatDate, getGoalPercent, sortByDateDesc } from '../data';
import '../style.less';

const Dashboard = () => {
	const { store } = useFitnessStore();
	const monthNow = moment();
	const workoutsInMonth = store.workouts.filter((item) => moment(item.date).isSame(monthNow, 'month'));
	const completedWorkouts = workoutsInMonth.filter((item) => item.status === 'completed');
	const totalCalories = completedWorkouts.reduce((sum, item) => sum + item.calories, 0);

	const doneDays = Array.from(
		new Set(
			store.workouts
				.filter((item) => item.status === 'completed')
				.map((item) => moment(item.date).startOf('day').format('YYYY-MM-DD')),
		),
	).sort((a, b) => moment(b).valueOf() - moment(a).valueOf());

	let streak = 0;
	let checkDate = moment().startOf('day');
	while (doneDays.includes(checkDate.format('YYYY-MM-DD'))) {
		streak += 1;
		checkDate = checkDate.subtract(1, 'day');
	}

	const goalAverage =
		store.goals.length > 0
			? Math.round(store.goals.reduce((sum, item) => sum + getGoalPercent(item), 0) / store.goals.length)
			: 0;

	const weekLabels = ['Tuan 1', 'Tuan 2', 'Tuan 3', 'Tuan 4', 'Tuan 5'];
	const weekData = weekLabels.map((_, index) => {
		const startDay = index * 7 + 1;
		const endDay = index === 4 ? 31 : startDay + 6;
		return completedWorkouts.filter((item) => {
			const day = moment(item.date).date();
			return day >= startDay && day <= endDay;
		}).length;
	});

	const weightLogs = [...store.healthLogs].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
	const recentWorkouts = sortByDateDesc(store.workouts).slice(0, 5);

	return (
		<div className='fitness-page'>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card className='fitness-stat-card'>
						<div className='fitness-stat-label'>Tong buoi tap trong thang</div>
						<div className='fitness-stat-value'>{completedWorkouts.length}</div>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className='fitness-stat-card'>
						<div className='fitness-stat-label'>Tong calo da dot</div>
						<div className='fitness-stat-value'>{totalCalories}</div>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className='fitness-stat-card'>
						<div className='fitness-stat-label'>So ngay tap lien tiep</div>
						<div className='fitness-stat-value'>{streak}</div>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className='fitness-stat-card'>
						<div className='fitness-stat-label'>Muc tieu hoan thanh</div>
						<div className='fitness-stat-value'>{goalAverage}%</div>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 4 }}>
				<Col xs={24} xl={14}>
					<Card title='So buoi tap theo tung tuan'>
						<ColumnChart
							title='So buoi tap'
							xAxis={weekLabels}
							yAxis={[weekData]}
							yLabel={['Buoi tap']}
							height={320}
							formatY={(value) => `${value}`}
						/>
					</Card>
				</Col>
				<Col xs={24} xl={10}>
					<Card title='Can nang theo thoi gian'>
						<LineChart
							title='Can nang'
							xAxis={weightLogs.map((item) => formatDate(item.date))}
							yAxis={[weightLogs.map((item) => item.weight)]}
							yLabel={['kg']}
							height={320}
							formatY={(value) => `${value} kg`}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='5 buoi tap gan nhat' style={{ marginTop: 16 }}>
				<Timeline>
					{recentWorkouts.map((item) => (
						<Timeline.Item key={item.id} color={item.status === 'completed' ? 'green' : 'red'}>
							<Space size={[8, 8]} wrap>
								<strong>{item.name}</strong>
								<Tag color='blue'>{item.type}</Tag>
								<Tag color={item.status === 'completed' ? 'green' : 'red'}>
									{item.status === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
								</Tag>
								<span>{formatDate(item.date)}</span>
								<span>{item.duration} phut</span>
								<span>{item.calories} calo</span>
							</Space>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default Dashboard;
