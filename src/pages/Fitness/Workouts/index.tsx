import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
} from 'antd';
import moment, { type Moment } from 'moment';
import { useState } from 'react';
import {
	createId,
	formatDate,
	inRange,
	sortByDateDesc,
	type WorkoutItem,
	type WorkoutStatus,
	type WorkoutType,
	useFitnessStore,
} from '../data';
import '../style.less';

const { RangePicker } = DatePicker;
const typeOptions: WorkoutType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];

type WorkoutForm = {
	date: Moment;
	name: string;
	type: WorkoutType;
	duration: number;
	calories: number;
	note: string;
	status: WorkoutStatus;
};

const Workouts = () => {
	const { store, setWorkouts } = useFitnessStore();
	const [form] = Form.useForm<WorkoutForm>();
	const [keyword, setKeyword] = useState('');
	const [typeValue, setTypeValue] = useState<WorkoutType | undefined>();
	const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);
	const [open, setOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<WorkoutItem | null>(null);

	const list = sortByDateDesc(store.workouts).filter((item) => {
		const matchName = item.name.toLowerCase().includes(keyword.trim().toLowerCase());
		const matchType = typeValue ? item.type === typeValue : true;
		const matchDate = inRange(item.date, dateRange);
		return matchName && matchType && matchDate;
	});

	const closeModal = () => {
		setOpen(false);
		setEditingItem(null);
		form.resetFields();
	};

	const openCreate = () => {
		setEditingItem(null);
		form.resetFields();
		form.setFieldsValue({
			date: moment(),
			type: 'Cardio',
			status: 'completed',
			duration: 30,
			calories: 200,
			note: '',
		});
		setOpen(true);
	};

	const openEdit = (item: WorkoutItem) => {
		setEditingItem(item);
		form.setFieldsValue({
			date: moment(item.date),
			name: item.name,
			type: item.type,
			duration: item.duration,
			calories: item.calories,
			note: item.note,
			status: item.status,
		});
		setOpen(true);
	};

	const handleDelete = (id: string) => {
		setWorkouts(store.workouts.filter((item) => item.id !== id));
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const nextItem: WorkoutItem = {
			id: editingItem?.id || createId(),
			date: values.date.toISOString(),
			name: values.name,
			type: values.type,
			duration: values.duration,
			calories: values.calories,
			note: values.note || '',
			status: values.status,
		};

		if (editingItem) {
			setWorkouts(store.workouts.map((item) => (item.id === editingItem.id ? nextItem : item)));
		} else {
			setWorkouts([nextItem, ...store.workouts]);
		}

		closeModal();
	};

	return (
		<div className='fitness-page'>
			<Card>
				<div className='fitness-toolbar'>
					<div className='fitness-toolbar-left'>
						<Input
							allowClear
							prefix={<SearchOutlined />}
							placeholder='Tim ten bai tap'
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
							style={{ width: 240 }}
						/>
						<Select
							allowClear
							placeholder='Loc theo loai'
							value={typeValue}
							onChange={setTypeValue}
							style={{ width: 180 }}
						>
							{typeOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
						<RangePicker value={dateRange as any} onChange={(value) => setDateRange(value as [Moment, Moment] | null)} />
					</div>
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
						Thêm buổi tập
					</Button>
				</div>

				<Table
					rowKey='id'
					dataSource={list}
					pagination={{ pageSize: 6 }}
					columns={[
						{
							title: 'Ngày',
							dataIndex: 'date',
							align: 'center',
							render: (value: string) => formatDate(value),
						},
						{
							title: 'Tên bài tập',
							dataIndex: 'name',
						},
						{
							title: 'Loại bài tập',
							dataIndex: 'type',
							align: 'center',
						},
						{
							title: 'Thời lượng (phút)',
							dataIndex: 'duration',
							align: 'center',
						},
						{
							title: 'Calo đốt',
							dataIndex: 'calories',
							align: 'center',
						},
						{
							title: 'Ghi chú',
							dataIndex: 'note',
							render: (value: string) => value || '-',
						},
						{
							title: 'Trạng thái',
							dataIndex: 'status',
							align: 'center',
							render: (value: WorkoutStatus) => (
								<Tag color={value === 'completed' ? 'green' : 'red'}>
									{value === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
								</Tag>
							),
						},
						{
							title: 'Thao tác',
							key: 'action',
							align: 'center',
							render: (_: unknown, item: WorkoutItem) => (
								<Space>
									<Button type='link' icon={<EditOutlined />} onClick={() => openEdit(item)}>
										Sửa
									</Button>
									<Popconfirm title='Xóa buổi tập này?' onConfirm={() => handleDelete(item.id)}>
										<Button type='link' danger icon={<DeleteOutlined />}>
											Xóa
										</Button>
									</Popconfirm>
								</Space>
							),
						},
					]}
				/>
			</Card>

			<Modal
				destroyOnClose
				title={editingItem ? 'Sửa buổi tập' : 'Thêm buổi tập'}
				visible={open}
				onCancel={closeModal}
				onOk={handleSubmit}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='date' label='Ngày tập' rules={[{ required: true, message: 'Nhập ngày tập' }]}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item name='name' label='Tên bài tập' rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại bài tập' rules={[{ required: true, message: 'Chọn loại bài tập' }]}>
						<Select>
							{typeOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='duration'
						label='Thời lượng (phút)'
						rules={[{ required: true, message: 'Nhập thời lượng' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='calories' label='Calo' rules={[{ required: true, message: 'Nhập calo' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='note' label='Ghi chú'>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Select>
							<Select.Option value='completed'>Hoàn thành</Select.Option>
							<Select.Option value='missed'>Bỏ lỡ</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Workouts;
