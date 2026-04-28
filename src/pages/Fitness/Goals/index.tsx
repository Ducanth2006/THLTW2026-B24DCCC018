import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Drawer,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Progress,
	Row,
	Segmented,
	Select,
	Space,
	Tag,
} from 'antd';
import moment, { type Moment } from 'moment';
import { useState } from 'react';
import {
	createId,
	formatDate,
	getGoalPercent,
	type GoalItem,
	type GoalStatus,
	type GoalType,
	useFitnessStore,
} from '../data';
import '../style.less';

const goalTypeOptions: GoalType[] = ['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'];
const goalStatusOptions: ('Tất cả' | GoalStatus)[] = ['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy'];

type GoalForm = {
	name: string;
	type: GoalType;
	targetValue: number;
	currentValue: number;
	deadline: Moment;
	status: GoalStatus;
};

const Goals = () => {
	const { store, setGoals } = useFitnessStore();
	const [form] = Form.useForm<GoalForm>();
	const [open, setOpen] = useState(false);
	const [statusValue, setStatusValue] = useState<'Tất cả' | GoalStatus>('Tất cả');
	const list = store.goals.filter((item) => (statusValue === 'Tất cả' ? true : item.status === statusValue));

	const closeDrawer = () => {
		setOpen(false);
		form.resetFields();
	};

	const openDrawer = () => {
		form.resetFields();
		form.setFieldsValue({
			type: 'Giảm cân',
			targetValue: 1,
			currentValue: 0,
			deadline: moment().add(30, 'day'),
			status: 'Đang thực hiện',
		});
		setOpen(true);
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const nextItem: GoalItem = {
			id: createId(),
			name: values.name,
			type: values.type,
			targetValue: values.targetValue,
			currentValue: values.currentValue,
			deadline: values.deadline.toISOString(),
			status: values.status,
		};
		setGoals([nextItem, ...store.goals]);
		closeDrawer();
	};

	const updateCurrentValue = (id: string, value?: number | null) => {
		setGoals(
			store.goals.map((item) =>
				item.id === id
					? {
							...item,
							currentValue: value || 0,
					  }
					: item,
			),
		);
	};

	const handleDelete = (id: string) => {
		setGoals(store.goals.filter((item) => item.id !== id));
	};

	return (
		<div className='fitness-page'>
			<Card
				title='Quản lý mục tiêu'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={openDrawer}>
						Thêm mục tiêu
					</Button>
				}
			>
				<div style={{ marginBottom: 16 }}>
					<Segmented options={goalStatusOptions} value={statusValue} onChange={(value) => setStatusValue(value as any)} />
				</div>
				<Row gutter={[16, 16]}>
					{list.map((item) => (
						<Col xs={24} md={12} xl={8} key={item.id}>
							<Card
								className='fitness-goal-card'
								title={item.name}
								extra={
									<Popconfirm title='Xóa mục tiêu này?' onConfirm={() => handleDelete(item.id)}>
										<Button type='link' danger icon={<DeleteOutlined />}>
											Xóa
										</Button>
									</Popconfirm>
								}
							>
								<Space direction='vertical' size={12} style={{ width: '100%' }}>
									<Space wrap>
										<Tag color='blue'>{item.type}</Tag>
										<Tag color={item.status === 'Đã đạt' ? 'green' : item.status === 'Đã hủy' ? 'red' : 'gold'}>
											{item.status}
										</Tag>
									</Space>
									<div>Giá trị mục tiêu: {item.targetValue}</div>
									<div>
										Giá trị hiện tại:
										<InputNumber
											className='fitness-inline-input'
											min={0}
											value={item.currentValue}
											onChange={(value) => updateCurrentValue(item.id, value)}
											style={{ marginTop: 6 }}
										/>
									</div>
									<div>
										<Progress percent={getGoalPercent(item)} />
									</div>
									<div>Deadline: {formatDate(item.deadline)}</div>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			</Card>

			<Drawer
				title='Thêm mục tiêu'
				visible={open}
				onClose={closeDrawer}
				width={420}
				footer={
					<div style={{ textAlign: 'right' }}>
						<Space>
							<Button onClick={closeDrawer}>Hủy</Button>
							<Button type='primary' onClick={handleSubmit}>
								Lưu
							</Button>
						</Space>
					</div>
				}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên mục tiêu' rules={[{ required: true, message: 'Nhập tên mục tiêu' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại' rules={[{ required: true, message: 'Chọn loại' }]}>
						<Select>
							{goalTypeOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='targetValue' label='Giá trị mục tiêu' rules={[{ required: true, message: 'Nhập giá trị mục tiêu' }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='currentValue' label='Giá trị hiện tại' rules={[{ required: true, message: 'Nhập giá trị hiện tại' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='deadline' label='Deadline' rules={[{ required: true, message: 'Chọn deadline' }]}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Select>
							<Select.Option value='Đang thực hiện'>Đang thực hiện</Select.Option>
							<Select.Option value='Đã đạt'>Đã đạt</Select.Option>
							<Select.Option value='Đã hủy'>Đã hủy</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default Goals;
